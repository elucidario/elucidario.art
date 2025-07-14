import { RawRuleOf, MongoAbility } from "@casl/ability";

import {
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

            return model.get();
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

                    return this.graph.parseNode<WorkspaceType>(first.get("u"));
                },
                cypher,
                params,
            );

            model.set(workspace);

            return model.get();
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

            model.set(
                await this.graph.executeQuery<WorkspaceType>(
                    (response) => {
                        if (response.records.length === 0) {
                            throw this.error("Workspace not found", 404);
                        }

                        const [first] = response.records;

                        return this.graph.parseNode<WorkspaceType>(
                            first.get("u"),
                        );
                    },
                    cypher,
                    params,
                ),
            );

            return model.get();
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

            this.validator.setModel(model);
            await this.validator.validateUUID(workspaceUUID);

            const workspaceNode = this.graph.cypher.NamedNode("workspace");
            const memberNode = this.graph.cypher.NamedNode("member");

            const matchWorkspace = this.graph.cypher.Match(
                this.graph.cypher.Pattern(workspaceNode, {
                    labels: ["Workspace"],
                    properties: {
                        uuid: this.graph.cypher.Param(workspaceUUID),
                    },
                }),
            );

            const matchMember = this.graph.cypher
                .OptionalMatch(
                    this.graph.cypher
                        .Pattern(memberNode, {
                            labels: ["Member"],
                        })
                        .related(this.graph.cypher.Relationship())
                        .to(workspaceNode),
                )
                .detachDelete(memberNode, workspaceNode)
                .with(memberNode, workspaceNode)
                .return([this.query.cypher.Literal(true), "removed"]);

            const { cypher, params } = this.query.cypher
                .concat(matchWorkspace, matchMember)
                .build();

            const removed = await this.graph.executeQuery<boolean>(
                ({ records }) => {
                    if (records.length === 0) {
                        throw this.error("WorkspaceType not found", 404);
                    }

                    const [first] = records;
                    return first.get("removed") as boolean;
                },
                cypher,
                params,
            );

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

                        return records.map((record) => {
                            return this.graph.parseNode<WorkspaceType>(
                                record.get("u"),
                            );
                        });
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
