import { FastifyRequest, FastifyReply } from "fastify";
import { RawRuleOf, MongoAbility } from "@casl/ability";
import { InvitedMember, TeamMemberOrInvitedMember } from "@elucidario/mdorim";

import {
    Hooks,
    QueryStrings,
    Body,
    ParamsWithWorkspace,
    AuthContext,
} from "@/types";
import { MembershipQuery } from "@/application/queries/core";
import { Graph } from "@/application/Graph";

import AService from "../AService";
import { Membership } from "@/domain/models/core";
import { Validator } from "@/application/Validator";
import { Authorization } from "@/application/Authorization";

/**
 * # MembershipService
 * This service class provides methods to manage memberships in the application.
 * It extends the AService class and implements methods for creating,
 * reading, updating, deleting, and listing memberships.
 */
export class MembershipService extends AService<
    TeamMemberOrInvitedMember,
    MembershipQuery
> {
    /**
     * MembershipService constructor
     * @param model - The membership model
     * @param query - The membership query
     * @param graph - The graph database instance
     * @param hooks - The service hooks
     * @param fastify - The Fastify instance
     */
    constructor(
        protected validator: Validator,
        protected query: MembershipQuery,
        protected authorization: Authorization,
        protected graph: Graph,
        protected hooks: Hooks,
    ) {
        super(validator, query, authorization, graph, hooks);
        this.register();
    }

    /**
     * ## Registers the service hooks for authorization rules.
     * This method adds a filter to the "authorization.rules" hook
     * to set abilities based on the user's role.
     */
    protected register() {
        this.hooks.filters.add<
            RawRuleOf<MongoAbility>[],
            [AuthContext<TeamMemberOrInvitedMember>]
        >("authorization.rules", (abilities, context) =>
            this.setAbilities(abilities, context),
        );
    }

    setAbilities(
        abilities: RawRuleOf<MongoAbility>[],
        context: AuthContext<TeamMemberOrInvitedMember>,
    ): RawRuleOf<MongoAbility>[] {
        console.log({ abilities, context });

        return abilities;
    }

    async invite(
        request: FastifyRequest<ParamsWithWorkspace & Body<InvitedMember>>,
        reply: FastifyReply,
    ): Promise<"ok"> {
        try {
            const { workspaceUUID } = this.getParams(request);

            await this.model.validateUUID(workspaceUUID);

            const data = this.parseBodyRequest(request);

            this.validateType(data.type);

            await this.model.validateEntity(data, `/core/${data.type}`);

            // const user = this.getUser(request);

            return reply.send(
                await this.graph.writeTransaction(async (tx) => {
                    const workspaceNode =
                        this.query.cypher.NamedNode("workspace");
                    const findWorkspace = this.query.cypher
                        .Match(
                            this.query.cypher.Pattern(workspaceNode, {
                                labels: "Workspace",
                                properties: {
                                    uuid: this.query.cypher.Param(
                                        workspaceUUID,
                                    ),
                                },
                            }),
                        )
                        .return(workspaceNode)
                        .build();

                    const founded = await tx.run(
                        findWorkspace.cypher,
                        findWorkspace.params,
                    );

                    if (founded.records.length === 0) {
                        throw this.error(
                            `Workspace with uuid ${workspaceUUID} not found`,
                        );
                    }

                    // Workspace found, now we can create a invitation
                    const { cypher, params } = this.query
                        .inviteToWorkspace({
                            workspaceUUID,
                            email: data.email!,
                            role: data.role!,
                        })
                        .build();

                    const { records } = await tx.run(cypher, params);

                    if (records.length === 0) {
                        throw this.error("Failed to create invitation");
                    }

                    return "ok" as const;
                }),
            );
        } catch (error: unknown) {
            throw this.error(error);
        }
    }

    async join(
        request: FastifyRequest<ParamsWithWorkspace>,
        reply: FastifyReply,
    ): Promise<"ok"> {
        try {
            const { workspaceUUID } = this.getParams(request);

            await this.model.validateUUID(workspaceUUID);

            const user = this.getUser(request);

            if (!user) {
                throw this.error("User not authenticated");
            }

            const userQuery = this.fastify.services.user.query;
            const workspaceQuery = this.fastify.services.workspace.query;

            return reply.send(
                await this.graph.writeTransaction(async (tx) => {
                    const findWorkspace = workspaceQuery
                        .read({
                            data: { uuid: workspaceUUID },
                            labels: "Workspace",
                        })
                        .build();
                    const founded = await tx.run(
                        findWorkspace.cypher,
                        findWorkspace.params,
                    );

                    if (founded.records.length === 0) {
                        throw this.error(
                            `Workspace with uuid ${workspaceUUID} not found`,
                        );
                    }

                    // Workspace found, now we can match InvitedMember and update it to TeamMember
                    const workspaceNode =
                        workspaceQuery.cypher.NamedNode("workspace");
                    const matchWorkspace = workspaceQuery.read({
                        data: { uuid: workspaceUUID },
                        labels: "Workspace",
                        node: workspaceNode,
                        returnClause: false,
                    });

                    const userNode = userQuery.cypher.NamedNode("user");
                    const matchUser = userQuery.read({
                        data: { uuid: user.uuid },
                        labels: "User",
                        node: userNode,
                        returnClause: false,
                    });

                    const memberNode = this.query.cypher.NamedNode("member");
                    const matchMember = this.query.read({
                        data: { email: user.email },
                        labels: "InvitedMember",
                        node: memberNode,
                        returnClause: false,
                    });

                    const withClause = this.query.cypher.With(
                        workspaceNode,
                        userNode,
                        memberNode,
                    );

                    const inviteMemberRelationship =
                        this.query.cypher.NamedRelationship("invitedTo");
                    const removeRelationWithWorkspace = this.query.cypher
                        .Match(
                            this.query.cypher
                                .Pattern(memberNode)
                                .related(inviteMemberRelationship, {
                                    type: "INVITED_TO",
                                })
                                .to(workspaceNode),
                        )
                        .delete(inviteMemberRelationship)
                        .with(memberNode, workspaceNode, userNode);

                    const memberOfRelationship =
                        this.query.cypher.NamedRelationship("memberOf");
                    const createMemberOfRelation = this.query.cypher
                        .Create(
                            this.query.cypher
                                .Pattern(memberNode)
                                .related(memberOfRelationship, {
                                    type: "MEMBER_OF",
                                })
                                .to(workspaceNode),
                        )
                        .with(memberNode, workspaceNode, userNode);

                    const updateLabel = this.query.cypher
                        .Match(this.query.cypher.Pattern(memberNode))
                        .remove(memberNode.label("InvitedMember"))
                        .set(memberNode.label("TeamMember"));

                    const returnClause = this.query.cypher.Return(
                        memberNode,
                        workspaceNode,
                        userNode,
                    );

                    const { cypher, params } = this.query.cypher
                        .concat(
                            matchWorkspace,
                            matchUser,
                            matchMember,
                            withClause,
                            removeRelationWithWorkspace,
                            createMemberOfRelation,
                            updateLabel,
                            returnClause,
                        )
                        .build();

                    const { records } = await tx.run(cypher, params);

                    if (records.length === 0) {
                        throw this.error("Failed to join Workspace");
                    }

                    return "ok" as const;
                }),
            );
        } catch (error: unknown) {
            throw this.error(error);
        }
    }

    /**
     * Updates a user in the database.
     * @param id - The user's ID.
     * @param args - The fields to update.
     * @returns The updated user.
     * @throws MdorimError if the user is invalid or update fails.
     */
    async update(
        request: FastifyRequest<
            ParamsWithWorkspace<{ userUUID: string }> &
                Body<TeamMemberOrInvitedMember>
        >,
        reply: FastifyReply,
    ): Promise<TeamMemberOrInvitedMember> {
        try {
            const { userUUID } = request.params;
            const data = this.parseBodyRequest(request);

            await this.model.validateUUID(userUUID);
            await this.model.validateEntity(data);

            const { cypher, params } = this.query
                .update({
                    uuid: userUUID,
                    data,
                    labels: "User",
                })
                .build();

            this.model.set(
                await this.graph.executeQuery<TeamMemberOrInvitedMember>(
                    (response) => {
                        if (response.records.length === 0) {
                            throw this.error("User not found");
                        }

                        const [first] = response.records;

                        return this.graph.parseNode<TeamMemberOrInvitedMember>(
                            first.get("u"),
                        );
                    },
                    cypher,
                    params,
                ),
            );

            return reply.send(this.model.get());
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Deletes a user from the database.
     * @param uuid - The user's ID.
     * @returns true if the user was deleted, false otherwise.
     * @throws MdorimError if the user is invalid or deletion fails.
     */
    async delete(
        request: FastifyRequest<ParamsWithWorkspace<{ userUUID: string }>>,
        reply: FastifyReply,
    ): Promise<boolean> {
        try {
            const { userUUID } = request.params;
            await this.model.validateUUID(userUUID);

            const { cypher, params } = this.query
                .delete({
                    uuid: userUUID,
                    labels: "User",
                })
                .build();

            const removed = await this.graph.executeQuery<boolean>(
                ({ records }) => {
                    if (records.length === 0) {
                        throw this.error("User not found");
                    }

                    const [first] = records;
                    return first.get("removed") as boolean;
                },
                cypher,
                params,
            );

            return reply.send(removed);
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Lists memberships in the database.
     * @param limit - The maximum number of memberships to return.
     * @param offset - The number of memberships to skip before starting to collect the result set.
     * @returns An array of memberships.
     * @throws MdorimError if listing fails.
     */
    async list(
        request: FastifyRequest<ParamsWithWorkspace & QueryStrings>,
        reply: FastifyReply,
    ): Promise<TeamMemberOrInvitedMember[]> {
        try {
            const { workspaceUUID } = this.getParams(request);
            const { limit, offset } = this.getQueryStrings(request);

            await this.model.validateUUID(workspaceUUID);
            await this.model.validateNumber(limit, true);
            await this.model.validateNumber(offset, true);

            const { cypher, params } = this.query
                .list({
                    limit,
                    offset,
                    labels: ["InvitedMember", "TeamMember"],
                    labelRelation: "OR",
                })
                .build();

            return reply.send(
                this.processList(
                    await this.graph.executeQuery<TeamMemberOrInvitedMember[]>(
                        (response) => {
                            const { records } = response;

                            if (records.length === 0) {
                                return [];
                            }

                            return records.map((record) => {
                                return this.graph.parseNode<TeamMemberOrInvitedMember>(
                                    record.get("u"),
                                );
                            });
                        },
                        cypher,
                        params,
                    ),
                ),
            );
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Processes a list of users, filtering out null and undefined values,
     * and initializing each user with the User model instance before returning
     * its properties.
     *
     * @param list - The list of users to process.
     * @returns An array of TeamMemberOrInvitedMember instances.
     */
    processList(
        list: Array<TeamMemberOrInvitedMember | null | undefined>,
    ): Array<TeamMemberOrInvitedMember> {
        return list
            .filter(
                (user): user is TeamMemberOrInvitedMember =>
                    user !== null && user !== undefined,
            )
            .map(
                (user) =>
                    new Membership(
                        this.model.mdorim,
                        user,
                    ).get() as TeamMemberOrInvitedMember,
            );
    }

    validateType(type: unknown): boolean {
        if (
            typeof type === "string" &&
            (type === "InvitedMember" || type === "TeamMember")
        ) {
            return true;
        }
        throw this.error(
            "Invalid membership type. Must be 'InvitedMember' or 'TeamMember'.",
        );
    }
}
