import { TeamMemberRole, User, Workspace } from "@elucidario/mdorim";
import AbstractService from "../AbstractService";
import { WorkspaceQuery } from "@/model";
import { Graph } from "@/db";
import { Hooks, WorkspaceParams } from "@/types";
import { WorkspaceInterfaceModel } from "@/model/workspace/WorkspaceInterface";
import { FastifyReply, FastifyRequest } from "fastify";

export class WorkspaceService extends AbstractService<Workspace> {
    model: WorkspaceInterfaceModel;

    constructor(
        model: WorkspaceInterfaceModel,
        query: WorkspaceQuery,
        graph: Graph,
        hooks: Hooks,
    ) {
        super(model, query, graph, hooks);
        this.model = model;
    }

    /**
     * Creates a new workspace in the database.
     * @param workspace - The workspace data to create.
     * @returns The created workspace.
     * @throws MdorimError if the workspace is invalid or creation fails.
     */
    async create(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<Workspace> {
        try {
            const data = this.parseBodyRequest(request);

            await this.model.validateEntity(data);

            const user = this.getUser(request);

            if (!user) {
                throw this.error("User not found");
            }

            const workspace = await this.graph.writeTransaction(async (tx) => {
                const workspaceNode = this.graph.cypher.NamedNode("workspace");
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
                        labels: ["Workspace"],
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
                                    role: this.graph.cypher.Literal("admin"),
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
                    throw this.error("Workspace not created");
                }

                const [first] = response.records;

                const workspaceRecord = this.graph.parseResponse<Workspace>(
                    first.get("workspace").properties,
                );

                const userRecord = this.graph.parseResponse<User>(
                    first.get("user").properties,
                );

                const memberOfRecord = this.graph.parseResponse<{
                    role: TeamMemberRole;
                }>(first.get("memberOf").properties);

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

            return reply.send(workspace);
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
        request: FastifyRequest<WorkspaceParams>,
        reply: FastifyReply,
    ): Promise<Workspace | null> {
        try {
            const { workspaceUUID } = request.params;

            await this.model.validateUUID(workspaceUUID);

            const { cypher, params } = this.query
                .read({ data: { uuid: workspaceUUID }, labels: "Workspace" })
                .build();

            const workspace = await this.graph.executeQuery<Workspace | null>(
                (response) => {
                    if (response.records.length === 0) {
                        return null;
                    }

                    const [first] = response.records;

                    return this.graph.parseResponse<Workspace>(
                        first.get("u").properties,
                    );
                },
                cypher,
                params,
            );

            return reply.send(workspace);
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
    async update(id: string, args: Partial<Workspace>): Promise<Workspace> {
        try {
            await this.validateUUID(id);
            await this.validateEntity(args);

            const { cypher, params } = this.queryUpdate(
                id,
                args,
                "Workspace",
            ).build();

            return await this.core.graph.executeQuery<Workspace>(
                (response) => {
                    if (response.records.length === 0) {
                        throw this.error("Workspace not found");
                    }

                    const [first] = response.records;

                    return this.parseResponse<Workspace>(
                        first.get("u").properties,
                    );
                },
                cypher,
                params,
            );
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
    async delete(id: string): Promise<boolean> {
        try {
            await this.validateUUID(id);

            const { cypher, params } = this.queryDelete(
                id,
                "Workspace",
            ).build();

            return await this.core.graph.executeQuery<boolean>(
                ({ records }) => {
                    if (records.length === 0) {
                        throw this.error("Workspace not found");
                    }

                    const [first] = records;
                    return first.get("removed") as boolean;
                },
                cypher,
                params,
            );
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
    async list(limit?: number, offset?: number): Promise<Workspace[]> {
        try {
            await this.validateNumber(limit, true);
            await this.validateNumber(offset, true);

            const { cypher, params } = this.queryList(
                limit,
                offset,
                "Workspace",
            ).build();

            return await this.core.graph.executeQuery<Workspace[]>(
                (response) => {
                    const { records } = response;

                    if (records.length === 0) {
                        return [];
                    }

                    return records.map((record) => {
                        return this.parseResponse<Workspace>(
                            record.get("u").properties,
                        );
                    });
                },
                cypher,
                params,
            );
        } catch (e) {
            console.log(e);
            throw this.error(e);
        }
    }

    /**
     * Retrieves a workspace by its name.
     * @param name - The name of the workspace to retrieve.
     * @returns The workspace if found, or null if not found.
     * @throws MdorimError if the name is invalid or retrieval fails.
     */
    async getByName(name: string): Promise<Workspace | null> {
        try {
            await this.validateName(name);

            const { cypher, params } = this.queryRead(
                { name },
                "Workspace",
            ).build();

            return await this.core.graph.executeQuery<Workspace | null>(
                (response) => {
                    if (response.records.length === 0) {
                        return null;
                    }

                    const [first] = response.records;
                    return this.parseResponse<Workspace>(
                        first.get("u").properties,
                    );
                },
                cypher,
                params,
            );
        } catch (e) {
            throw this.error(e);
        }
    }
}
