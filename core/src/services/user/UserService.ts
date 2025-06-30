import { FastifyRequest, FastifyReply } from "fastify";

import { Hooks, ListQueryStrings, Body, Params } from "@/types";
import { User as UserType } from "@elucidario/mdorim";
import { UserQuery } from "@/queries";
import { Graph } from "@/db";

import AbstractService from "../AbstractService";
import { User } from "@/model";

/**
 * # UserService
 * This service class provides methods to manage users in the application.
 * It extends the AbstractService class and implements methods for creating,
 * reading, updating, deleting, and listing users.
 */
export class UserService extends AbstractService<
    UserType,
    User,
    UserQuery,
    { userUUID: string }
> {
    /**
     * UserService constructor
     * @param model - The user model
     * @param query - The user query
     * @param graph - The graph database instance
     * @param hooks - The service hooks
     */
    constructor(model: User, query: UserQuery, graph: Graph, hooks: Hooks) {
        super(model, query, graph, hooks);
    }

    /**
     * Creates a new user in the database.
     * @param email - The user's email address.
     * @param password - The user's password.
     * @param username - The user's username.
     * @returns The created user.
     * @throws MdorimError if the user is invalid or creation fails.
     */
    async create(
        request: FastifyRequest<Body<UserType>>,
        reply: FastifyReply,
    ): Promise<UserType> {
        try {
            const userData = this.parseBodyRequest(request);

            await this.model.validateEntity(userData);

            const node = "user";
            const { cypher, params } = this.query
                .create({
                    data: userData,
                    labels: "User",
                    node,
                })
                .build();

            this.model.set(
                await this.graph.executeQuery<UserType>(
                    (response) => {
                        if (response.records.length === 0) {
                            throw this.error("User not created");
                        }

                        const [first] = response.records;

                        return this.graph.parseNode<UserType>(first.get(node));
                    },
                    cypher,
                    params,
                ),
            );

            return reply.send(this.model.get());
        } catch (e: unknown) {
            throw this.error(e);
        }
    }

    /**
     * Reads a user from the database.
     * @param id - The user's ID.
     * @returns The user, or null if not found.
     * @throws MdorimError if the user is invalid or reading fails.
     */
    async read(
        request: FastifyRequest<Params<{ userUUID: string }>>,
        reply: FastifyReply,
    ): Promise<UserType | null> {
        try {
            const { userUUID } = request.params;
            await this.model.validateUUID(userUUID);

            const { cypher, params } = this.query
                .read({
                    data: { uuid: userUUID },
                    labels: "User",
                })
                .build();

            this.model.set(
                await this.graph.executeQuery<UserType | null>(
                    (response) => {
                        if (response.records.length === 0) {
                            return null;
                        }

                        const [first] = response.records;

                        return this.graph.parseNode<UserType>(first.get("u"));
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
     * Updates a user in the database.
     * @param id - The user's ID.
     * @param args - The fields to update.
     * @returns The updated user.
     * @throws MdorimError if the user is invalid or update fails.
     */
    async update(
        request: FastifyRequest<Params<{ userUUID: string }> & Body<UserType>>,
        reply: FastifyReply,
    ): Promise<UserType> {
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
                await this.graph.executeQuery<UserType>(
                    (response) => {
                        if (response.records.length === 0) {
                            throw this.error("User not found");
                        }

                        const [first] = response.records;

                        return this.graph.parseNode<UserType>(first.get("u"));
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
        request: FastifyRequest<Params<{ userUUID: string }>>,
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
     * Lists users in the database.
     * @param limit - The maximum number of users to return.
     * @param offset - The number of users to skip before starting to collect the result set.
     * @returns An array of users.
     * @throws MdorimError if listing fails.
     */
    async list(
        request: FastifyRequest<ListQueryStrings>,
        reply: FastifyReply,
    ): Promise<UserType[]> {
        try {
            const { limit, offset } = this.getListQueryStrings(request);
            await this.model.validateNumber(limit);
            await this.model.validateNumber(offset);

            const { cypher, params } = this.query
                .list({
                    limit,
                    offset,
                    labels: "User",
                })
                .build();

            this.model.set(
                await this.graph.executeQuery<UserType[]>(
                    (response) => {
                        const { records } = response;

                        if (records.length === 0) {
                            return [];
                        }

                        return records.map((record) => {
                            return this.graph.parseNode<UserType>(
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
