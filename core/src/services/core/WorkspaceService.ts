import {
    TeamMemberRole,
    User,
    Workspace as WorkspaceType,
} from "@elucidario/mdorim";
import AbstractService from "../AbstractService";
import { WorkspaceQuery } from "@/queries";
import { Graph } from "@/db";
import { Hooks, Body, Params, QueryStrings } from "@/types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Workspace } from "@/model";

export class WorkspaceService extends AbstractService<
    WorkspaceType,
    Workspace,
    WorkspaceQuery,
    { workspaceUUID: string }
> {
    /**
     * WorkspaceService constructor
     * @param model - The workspace model
     * @param query - The workspace query
     * @param graph - The graph database instance
     * @param hooks - The service hooks
     * @param fastify - The Fastify instance
     */
    constructor(
        model: Workspace,
        query: WorkspaceQuery,
        graph: Graph,
        hooks: Hooks,
        fastify: FastifyInstance,
    ) {
        super(model, query, graph, hooks, fastify);
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
                throw this.error("User not found", 404);
            }

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

                const membershipQuery = this.fastify.services.membership.query;

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

            this.model.set(workspace);

            return reply.code(201).send(this.model.get());
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
                    labels: "Workspace",
                })
                .build();

            this.model.set(
                await this.graph.executeQuery<WorkspaceType | null>(
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
                    labels: "Workspace",
                })
                .build();

            this.model.set(
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

            return reply.send(this.model.get());
        } catch (e) {
            console.log(e);
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
                this.model.set(null);
                return reply.code(204).send();
            } else {
                throw this.error("Workspace not deleted", 500);
            }
        } catch (e) {
            console.error(e);
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
        request: FastifyRequest<QueryStrings>,
        reply: FastifyReply,
    ): Promise<WorkspaceType[]> {
        try {
            const { limit, offset } = this.getQueryStrings(request);

            await this.model.validateNumber(limit, true);
            await this.model.validateNumber(offset, true);

            const { cypher, params } = this.query
                .list({
                    limit,
                    offset,
                    labels: "Workspace",
                })
                .build();

            return reply.send(
                this.processList(
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
                (workspace) =>
                    new Workspace(
                        this.model.mdorim,
                        workspace,
                    ).get() as WorkspaceType,
            );
    }
}
