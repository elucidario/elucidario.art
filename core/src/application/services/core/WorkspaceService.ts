import { RawRuleOf, MongoAbility } from "@casl/ability";

import {
    TeamMemberOrInvitedMember,
    TeamMemberRole,
    User,
    UUID,
    Workspace as WorkspaceType,
} from "@elucidario/mdorim";

import AService from "../AService";
import { MembershipQuery, WorkspaceQuery } from "@/application/queries/core";
import { Graph } from "@/application/Graph";
import { Hooks, AuthContext, ListParams } from "@/types";
import { Workspace } from "@/domain/models/core";
import { Validator } from "@/application/Validator";
import { Auth } from "@/application/auth/Auth";
import { ManagedTransaction, RecordShape } from "neo4j-driver";

export class WorkspaceService extends AService<WorkspaceType, WorkspaceQuery> {
    /**
     * WorkspaceService constructor
     * @param model - The workspace model
     * @param query - The workspace query
     * @param graph - The graph database instance
     * @param hooks - The service hooks
     * @param fastify - The Fastify instance
     */
    constructor(
        protected validator: Validator,
        protected query: WorkspaceQuery,
        protected auth: Auth,
        protected graph: Graph,
        protected hooks: Hooks,
    ) {
        super(validator, query, auth, graph, hooks);
        this.register();
    }

    /**
     * ## Registers the service hooks for authorization rules.
     * This method adds a filter to the "authorization.rules" hook
     * to set abilities based on the user's role.
     */
    protected register() {
        this.hooks.filters.add<RawRuleOf<MongoAbility>[], [AuthContext]>(
            "authorization.rules",
            (abilities, context) => this.setAbilities(abilities, context),
        );
    }

    /**
     * ## Sets the abilities for the user based on their role.
     * This method modifies the abilities array to include management permissions.
     *
     * @param abilities - The current abilities array.
     * @param context - The authentication context containing user and role information.
     * @returns The modified abilities array.
     */
    protected setAbilities(
        abilities: RawRuleOf<MongoAbility>[],
        context: AuthContext,
    ): RawRuleOf<MongoAbility>[] {
        const { role } = context;

        if (["admin", "sysadmin"].includes(role)) {
            abilities.push({
                action: "manage",
                subject: "Workspace",
            });
        }

        return abilities;
    }

    /**
     * Creates a new workspace in the database.
     * @param workspace - The workspace data to create.
     * @returns The created workspace.
     * @throws MdorimError if the workspace is invalid or creation fails.
     */
    async create(data: Partial<WorkspaceType>): Promise<WorkspaceType> {
        try {
            const model = new Workspace();
            if (!this.getPermissions().can("create", model)) {
                throw this.error("Unauthorized", 403);
            }
            this.validator.setModel(model);
            await this.validator.validateEntity({ data });

            const context = this.getContext();

            if (!context?.user) {
                throw this.error("User not found", 404);
            }

            const user = context.user as User;

            const workspace = await this.graph.writeTransaction(async (tx) => {
                const workspaceNode = this.graph.cypher.NamedNode("workspace");
                const mergeWorkspace = this.query
                    .create({
                        data,
                        labels: "Workspace",
                        node: workspaceNode,
                    })
                    .build();

                const { records } = await tx.run(
                    mergeWorkspace.cypher,
                    mergeWorkspace.params,
                );

                if (records.length === 0) {
                    throw this.error("Workspace not created", 500);
                }

                const workspaceRecord = this.graph.parseNode<WorkspaceType>(
                    records[0].get("workspace"),
                );

                if (!workspaceRecord) {
                    // in case workspace is null
                    throw this.error("Workspace not created", 500);
                }

                await this.history(tx, "CREATE", workspaceRecord, user.uuid!);

                const membershipQuery = new MembershipQuery(this.query.cypher);

                const { cypher, params } = membershipQuery
                    .addToWorkspace({
                        workspaceUUID: workspaceRecord.uuid!,
                        userUUID: user.uuid!,
                        role: "admin",
                    })
                    .build();

                const response = await tx.run(cypher, params);

                if (response.records.length === 0) {
                    throw this.error("Workspace not created");
                }

                const [first] = response.records;

                const userRecord = this.graph.parseNode<User>(
                    first.get("user"),
                );

                const memberRecord =
                    this.graph.parseNode<TeamMemberOrInvitedMember>(
                        first.get("member"),
                    );

                if (!memberRecord) {
                    throw this.error("Could not create member", 500);
                }

                await this.history(tx, "CREATE", memberRecord, user.uuid!);

                const memberOfRecord = this.graph.parseRelationship<{
                    role: TeamMemberRole;
                }>(first.get("memberOf"));

                return {
                    ...workspaceRecord,
                    team: [
                        {
                            user: userRecord,
                            role: memberOfRecord.role,
                        },
                    ],
                };
            });

            model.set(workspace);

            return model.get() as WorkspaceType;
        } catch (e: unknown) {
            throw this.error(e);
        }
    }

    /**
     * Reads a workspace from the database.
     * @param id - The ID of the workspace to read.
     * @returns The workspace data or null if not found.
     * @throws MdorimError if the ID is invalid or reading fails.
     */
    async read(data: Partial<WorkspaceType>): Promise<WorkspaceType> {
        try {
            const model = new Workspace();
            if (!this.getPermissions().can("read", model)) {
                throw this.error("Unauthorized", 403);
            }

            this.validator.setModel(model);

            await this.validator.validateEntity({ data });

            const { cypher, params } = this.query
                .read({
                    data,
                    labels: "Workspace",
                })
                .build();

            const workspace = await this.graph.executeQuery<
                WorkspaceType | undefined
            >(
                ({ records }) => {
                    if (records.length === 0) {
                        throw this.error("Workspace not found", 404);
                    }

                    const [first] = records;

                    const workspaceRecord = this.graph.parseNode<WorkspaceType>(
                        first.get("u"),
                    );

                    if (!workspaceRecord) {
                        throw this.error("Workspace not found", 404);
                    }

                    return workspaceRecord;
                },
                cypher,
                params,
            );

            model.set(workspace);

            return model.get() as WorkspaceType;
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Updates a workspace in the database.
     * @param id - The ID of the workspace to update.
     * @param args - The new data for the workspace.
     * @returns The updated workspace.
     * @throws MdorimError if the ID is invalid, the data is invalid, or updating fails.
     */
    async update(
        workspaceUUID: UUID,
        data: Partial<WorkspaceType>,
    ): Promise<WorkspaceType> {
        try {
            const model = new Workspace();
            if (!this.getPermissions().can("update", model)) {
                throw this.error("Unauthorized", 403);
            }

            this.validator.setModel(model);
            await this.validator.validateUUID(workspaceUUID);
            await this.validator.validateEntity({ data });

            const { cypher, params } = this.query
                .update({
                    uuid: workspaceUUID!,
                    data,
                    labels: "Workspace",
                })
                .build();

            const workspace = await this.graph.writeTransaction(async (tx) => {
                const { records } = await tx.run(cypher, params);

                if (records.length === 0) {
                    throw this.error("Workspace not found", 404);
                }

                const [first] = records;

                const workspaceRecord = this.graph.parseNode<WorkspaceType>(
                    first.get("u"),
                );

                if (!workspaceRecord) {
                    throw this.error("Workspace not found", 404);
                }

                const user = this.getContext()!.user as User;

                if (!user || !user.uuid) {
                    throw this.error("User not found", 404);
                }

                await this.history(
                    tx,
                    "UPDATE",
                    {
                        type: workspaceRecord.type,
                        uuid: workspaceRecord.uuid,
                        ...data,
                    },
                    user.uuid!,
                );

                return workspaceRecord;
            });

            model.set(workspace);

            return model.get() as WorkspaceType;
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Deletes a workspace from the database.
     * @param id - The ID of the workspace to delete.
     * @returns true if the workspace was deleted, false otherwise.
     * @throws MdorimError if the ID is invalid or deletion fails.
     */
    async delete(workspaceUUID: UUID): Promise<boolean> {
        try {
            const model = new Workspace();
            if (!this.getPermissions().can("delete", model)) {
                throw this.error("Unauthorized", 403);
            }

            const workspace = await this.read({ uuid: workspaceUUID });
            if (!workspace) {
                throw this.error("Workspace not found", 404);
            }

            const user = this.getContext()?.user as User;
            if (!user || !user.uuid) {
                throw this.error("User not found", 404);
            }

            this.validator.setModel(model);
            await this.validator.validateUUID(workspaceUUID);

            const removed = await this.graph.writeTransaction(async (tx) => {
                await this.history(tx, "DELETE", workspace, user.uuid);

                const workspaceNode = this.graph.cypher.NamedNode("workspace");

                const deleteWorkspace = this.graph.cypher
                    .Match(
                        this.graph.cypher.Pattern(workspaceNode, {
                            labels: ["Workspace"],
                            properties: {
                                uuid: this.graph.cypher.Param(workspaceUUID),
                            },
                        }),
                    )
                    .with(workspaceNode)
                    .detachDelete(workspaceNode)
                    .return([this.graph.cypher.Literal(true), "removed"]);

                const { cypher, params } = this.query.cypher
                    .concat(deleteWorkspace)
                    .build();

                await this.removeWorkspaceMembers(
                    tx,
                    workspaceUUID,
                    user.uuid!,
                );

                const { records } = await tx.run(cypher, params);

                if (records.length === 0) {
                    throw this.error("Workspace not found", 404);
                }

                const [first] = records;

                const removed = first.get("removed") as boolean;

                return removed;
            });

            if (removed) {
                model.set(undefined);
                return true;
            } else {
                throw this.error("Workspace not deleted", 500);
            }
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Removes all members from a workspace.
     * @param tx - The transaction to use.
     * @param workspaceUUID - The UUID of the workspace.
     * @param userUUID - The UUID of the user performing the action.
     * @returns A promise that resolves to true if members were removed, false otherwise.
     */
    protected async removeWorkspaceMembers(
        tx: ManagedTransaction,
        workspaceUUID: UUID,
        userUUID: UUID,
    ) {
        const memberNode = this.graph.cypher.NamedNode("member");
        const workspaceNode = this.graph.cypher.NamedNode("workspace");

        const matchWorkspace = this.graph.cypher.Match(
            this.graph.cypher.Pattern(workspaceNode, {
                labels: ["Workspace"],
                properties: {
                    uuid: this.graph.cypher.Param(workspaceUUID),
                },
            }),
        );

        const matchMembers = this.graph.cypher
            .OptionalMatch(
                this.graph.cypher
                    .Pattern(memberNode, {
                        labels: ["Member"],
                    })
                    .related(this.graph.cypher.Relationship())
                    .to(workspaceNode),
            )
            .with(memberNode, workspaceNode)
            .return(workspaceNode, [
                this.graph.cypher.collect(memberNode),
                "members",
            ]);

        const { cypher, params } = this.query.cypher
            .concat(matchWorkspace, matchMembers)
            .build();

        return tx.run(cypher, params).then(async (response) => {
            if (response.records.length === 0) {
                throw this.error("Workspace not found", 404);
            }

            const [first] = response.records;
            // first we get the members of the workspace
            const members: TeamMemberOrInvitedMember[] = first
                .get("members")
                .map((node: RecordShape) => {
                    return this.graph.parseNode<TeamMemberOrInvitedMember>(
                        node,
                    );
                })
                .filter(
                    (
                        member: null | TeamMemberOrInvitedMember,
                    ): member is TeamMemberOrInvitedMember =>
                        member !== null && member !== undefined,
                );

            if (!members || members.length === 0) {
                return false; // No members to remove
            }
            // then we add the history for each member to be removed
            await Promise.all(
                members.map((member) => {
                    return this.history(tx, "DELETE", member, userUUID);
                }),
            );

            // finally we delete the members from the workspace
            const deleteMemberNode = this.graph.cypher.NamedNode("member");
            const deleteMembers = this.graph.cypher
                .Match(
                    this.graph.cypher
                        .Pattern(deleteMemberNode, {
                            labels: ["Member"],
                        })
                        .related(this.graph.cypher.Relationship(), {
                            type: "MEMBER_OF",
                        })
                        .to(this.graph.cypher.NamedNode("workspace"), {
                            labels: ["Workspace"],
                            properties: {
                                uuid: this.graph.cypher.Param(workspaceUUID),
                            },
                        }),
                )
                .detachDelete(deleteMemberNode)
                .return([this.graph.cypher.Literal(true), "removed"])
                .build();

            const deleted = await tx.run(
                deleteMembers.cypher,
                deleteMembers.params,
            );

            if (deleted.records.length === 0) {
                throw this.error("Members not deleted", 500);
            }

            return deleted.records[0].get("removed") as boolean;
        });
    }

    /**
     * Lists all workspaces in the database.
     * @param limit - The maximum number of workspaces to return.
     * @param offset - The number of workspaces to skip before starting to collect the result set.
     * @returns An array of workspaces.
     * @throws MdorimError if the limit or offset is invalid or listing fails.
     */
    async list(args?: ListParams): Promise<WorkspaceType[]> {
        try {
            const model = new Workspace();
            if (!this.getPermissions().can("read", model)) {
                throw this.error("Unauthorized", 403);
            }

            this.validator.setModel(model);
            await this.validator.validateNumber(args?.limit, true);
            await this.validator.validateNumber(args?.offset, true);

            const { cypher, params } = this.query
                .list({
                    limit: args?.limit,
                    offset: args?.offset,
                    labels: "Workspace",
                })
                .build();

            return this.processList(
                await this.graph.executeQuery<WorkspaceType[]>(
                    (response) => {
                        const { records } = response;

                        if (records.length === 0) {
                            return [];
                        }

                        return records
                            .map((record) => {
                                return this.graph.parseNode<WorkspaceType>(
                                    record.get("u"),
                                );
                            })
                            .filter(
                                (workspace): workspace is WorkspaceType =>
                                    workspace !== null &&
                                    workspace !== undefined,
                            );
                    },
                    cypher,
                    params,
                ),
            );
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Processes a list of workspaces, filtering out null and undefined values,
     * and initializing each workspace with the Workspace model instance before returning
     * its properties.
     *
     * @param list - The list of workspaces to process.
     * @returns An array of WorkspaceType instances.
     */
    processList(
        list: Array<WorkspaceType | null | undefined>,
    ): Array<WorkspaceType> {
        return list
            .filter(
                (workspace): workspace is WorkspaceType =>
                    workspace !== null && workspace !== undefined,
            )
            .map(
                (workspace) => new Workspace(workspace).get() as WorkspaceType,
            );
    }
}
