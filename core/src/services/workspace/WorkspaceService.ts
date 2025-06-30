import {
    TeamMemberRole,
    User,
    Workspace as WorkspaceType,
} from "@elucidario/mdorim";
import AbstractService from "../AbstractService";
import { WorkspaceQuery } from "@/queries";
import { Graph } from "@/db";
import { Hooks, Body, Params, ListQueryStrings } from "@/types";
import { FastifyReply, FastifyRequest } from "fastify";
import { Workspace } from "@/model";

export class WorkspaceService extends AbstractService<
    WorkspaceType,
    Workspace,
    WorkspaceQuery,
    { workspaceUUID: string }
> {
    constructor(
        model: Workspace,
        query: WorkspaceQuery,
        graph: Graph,
        hooks: Hooks,
    ) {
        super(model, query, graph, hooks);
    }

    /**
     * Creates a new workspace in the database.
     * @param workspace - The workspace data to create.
     * @returns The created workspace.
     * @throws MdorimError if the workspace is invalid or creation fails.
     */
    async create(
        request: FastifyRequest<Body<WorkspaceType>>,
        reply: FastifyReply,
    ): Promise<WorkspaceType> {
        try {
            const data = this.parseBodyRequest(request);

            await this.model.validateEntity(data);

            const user = this.getUser(request);

            if (!user) {
                throw this.error("User not found");
            }

            this.model.set(
                await this.graph.writeTransaction(async (tx) => {
                    const workspaceNode =
                        this.graph.cypher.NamedNode("workspace");
                    const userNode = this.graph.cypher.NamedNode("user");
                    const memberOf =
                        this.graph.cypher.NamedRelationship("memberOf");

                    const matchUser = this.graph.cypher.Match(
                        this.graph.cypher.Pattern(userNode, {
                            labels: ["User"],
                            properties: {
                                uuid: this.graph.cypher.Param(user.uuid),
                            },
                        }),
                    );

                    const mergeWorkspace = this.graph.cypher.Merge(
                        this.graph.cypher.Pattern(workspaceNode, {
                            labels: ["WorkspaceType"],
                            properties: {
                                uuid: this.graph.cypher.Uuid(),
                                name: this.graph.cypher.Param(data.name),
                                description: this.graph.cypher.Param(
                                    data.description,
                                ),
                            },
                        }),
                    );

                    const createOwnership = this.graph.cypher
                        .Create(
                            this.graph.cypher
                                .Pattern(userNode)
                                .related(memberOf, {
                                    type: "MEMBER_OF",
                                    properties: {
                                        role: this.graph.cypher.Literal(
                                            "admin",
                                        ),
                                    },
                                })
                                .to(workspaceNode),
                        )
                        .with(userNode, memberOf, workspaceNode);

                    const returnClause = this.graph.cypher.Return(
                        userNode,
                        memberOf,
                        workspaceNode,
                    );

                    const { cypher, params } = this.graph.cypher
                        .concat(
                            matchUser,
                            mergeWorkspace,
                            createOwnership,
                            returnClause,
                        )
                        .build();

                    const response = await tx.run(cypher, params);

                    if (response.records.length === 0) {
                        throw this.error("WorkspaceType not created");
                    }

                    const [first] = response.records;

                    const workspaceRecord = this.graph.parseNode<WorkspaceType>(
                        first.get("workspace"),
                    );

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
                }),
            );

            return reply.send(this.model.get());
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
    async read(
        request: FastifyRequest<Params<{ workspaceUUID: string }>>,
        reply: FastifyReply,
    ): Promise<WorkspaceType | null> {
        try {
            const { workspaceUUID } = request.params;

            await this.model.validateUUID(workspaceUUID);

            const { cypher, params } = this.query
                .read({
                    data: { uuid: workspaceUUID },
                    labels: "WorkspaceType",
                })
                .build();

            this.model.set(
                await this.graph.executeQuery<WorkspaceType | null>(
                    (response) => {
                        if (response.records.length === 0) {
                            return null;
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

            return reply.send(this.model.get());
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
        request: FastifyRequest<
            Params<{ workspaceUUID: string }> & Body<WorkspaceType>
        >,
        reply: FastifyReply,
    ): Promise<WorkspaceType> {
        try {
            const { workspaceUUID } = this.getParams(request);
            const data = this.parseBodyRequest(request);

            await this.model.validateUUID(workspaceUUID);
            await this.model.validateEntity(data);

            const { cypher, params } = this.query
                .update({
                    uuid: workspaceUUID,
                    data,
                    labels: "WorkspaceType",
                })
                .build();

            this.model.set(
                await this.graph.executeQuery<WorkspaceType>(
                    (response) => {
                        if (response.records.length === 0) {
                            throw this.error("WorkspaceType not found");
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

            return reply.send(this.model.get());
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
    async delete(
        request: FastifyRequest<Params<{ workspaceUUID: string }>>,
        reply: FastifyReply,
    ): Promise<boolean> {
        try {
            const { workspaceUUID } = this.getParams(request);
            await this.model.validateUUID(workspaceUUID);

            const { cypher, params } = this.query
                .delete({
                    uuid: workspaceUUID,
                    labels: "WorkspaceType",
                })
                .build();

            const removed = await this.graph.executeQuery<boolean>(
                ({ records }) => {
                    if (records.length === 0) {
                        throw this.error("WorkspaceType not found");
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
     * Lists all workspaces in the database.
     * @param limit - The maximum number of workspaces to return.
     * @param offset - The number of workspaces to skip before starting to collect the result set.
     * @returns An array of workspaces.
     * @throws MdorimError if the limit or offset is invalid or listing fails.
     */
    async list(
        request: FastifyRequest<ListQueryStrings>,
        reply: FastifyReply,
    ): Promise<WorkspaceType[]> {
        try {
            const { limit, offset } = this.getListQueryStrings(request);

            await this.model.validateNumber(limit, true);
            await this.model.validateNumber(offset, true);

            const { cypher, params } = this.query
                .list({
                    limit,
                    offset,
                    labels: "WorkspaceType",
                })
                .build();

            this.model.set(
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

            return reply.send(this.model.get());
        } catch (e) {
            throw this.error(e);
        }
    }
}
