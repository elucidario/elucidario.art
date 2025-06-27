import { FastifyRequest, FastifyReply } from "fastify";

import { Hooks, ListQueryStrings, UserBody, UserParams } from "@/types";
import { User } from "@elucidario/mdorim";
import { UserQuery } from "@/queries";
import { Graph } from "@/db";

import InterfaceModel from "@/model/InterfaceModel";
import AbstractService from "../AbstractService";

/**
 * # UserService
 * This service class provides methods to manage users in the application.
 * It extends the AbstractService class and implements methods for creating,
 * reading, updating, deleting, and listing users.
 */
export class UserService extends AbstractService<User> {
    /**
     * UserService constructor
     * @param model - The user model
     * @param query - The user query
     * @param graph - The graph database instance
     * @param hooks - The service hooks
     */
    constructor(
        model: InterfaceModel<User>,
        query: UserQuery,
        graph: Graph,
        hooks: Hooks,
    ) {
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
    async create(request: FastifyRequest, reply: FastifyReply): Promise<User> {
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
                await this.graph.executeQuery<User>(
                    (response) => {
                        if (response.records.length === 0) {
                            throw this.error("User not created");
                        }

                        const [first] = response.records;

                        return this.graph.parseResponse<User>(
                            first.get(node).properties,
                        );
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
        request: FastifyRequest<UserParams>,
        reply: FastifyReply<UserParams>,
    ): Promise<User | null> {
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
                await this.graph.executeQuery<User | null>(
                    (response) => {
                        if (response.records.length === 0) {
                            return null;
                        }

                        const [first] = response.records;

                        return this.graph.parseResponse<User>(
                            first.get("u").properties,
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
     * Updates a user in the database.
     * @param id - The user's ID.
     * @param args - The fields to update.
     * @returns The updated user.
     * @throws MdorimError if the user is invalid or update fails.
     */
    async update(
        request: FastifyRequest<UserParams & UserBody>,
        reply: FastifyReply<UserParams & UserBody>,
    ): Promise<User> {
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
                await this.graph.executeQuery<User>(
                    (response) => {
                        if (response.records.length === 0) {
                            throw this.error("User not found");
                        }

                        const [first] = response.records;

                        return this.graph.parseResponse<User>(
                            first.get("u").properties,
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
        request: FastifyRequest<UserParams>,
        reply: FastifyReply<UserParams>,
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
        request: FastifyRequest<UserParams & ListQueryStrings>,
        reply: FastifyReply<UserParams>,
    ): Promise<User[]> {
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
                await this.graph.executeQuery<User[]>(
                    (response) => {
                        const { records } = response;

                        if (records.length === 0) {
                            return [];
                        }

                        return records.map((record) => {
                            return this.graph.parseResponse<User>(
                                record.get("u").properties,
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
