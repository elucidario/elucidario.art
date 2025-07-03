import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { RawRuleOf, MongoAbility } from "@casl/ability";

import {
    Hooks,
    QueryStrings,
    Body,
    ParamsWithWorkspace,
    AuthContext,
} from "@/types";
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
     * # UserService constructor
     * @param model - The user model
     * @param query - The user query
     * @param graph - The graph database instance
     * @param hooks - The service hooks
     * @param fastify - The Fastify instance
     */
    constructor(
        model: User,
        query: UserQuery,
        graph: Graph,
        hooks: Hooks,
        fastify: FastifyInstance,
    ) {
        super(model, query, graph, hooks, fastify);
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
            [AuthContext<UserType>]
        >("authorization.rules", (abilities, context) =>
            this.setAbilities(abilities, context),
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
        context: AuthContext<UserType>,
    ): RawRuleOf<MongoAbility>[] {
        const { role } = context;

        if (["admin", "sysadmin"].includes(role)) {
            abilities.push({
                action: "manage",
                subject: "User",
            });
        }

        return abilities;
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
        request: FastifyRequest<
            ParamsWithWorkspace<{ userUUID: string }> &
                Body<UserType> &
                QueryStrings
        >,
        reply: FastifyReply,
    ): Promise<UserType> {
        try {
            const userData = this.parseBodyRequest(request);

            await this.model.validateEntity(userData);
            await this.model.validateEmail(userData.email);
            await this.model.validateUsername(userData.username);

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
                            throw this.error("User not created", 500);
                        }

                        const [first] = response.records;

                        return this.graph.parseNode<UserType>(first.get(node));
                    },
                    cypher,
                    params,
                ),
            );

            return reply.code(201).send(this.model.get());
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
        request: FastifyRequest<
            ParamsWithWorkspace<{ userUUID: string }> &
                Body<UserType> &
                QueryStrings
        >,
        reply: FastifyReply,
    ): Promise<UserType | null> {
        try {
            await this.processRequest(request);

            if (!this.getPermissions().can("read", this.model)) {
                throw this.error("Unauthorized", 403);
            }

            const { userUUID } = this.getParams(request);
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
        request: FastifyRequest<
            ParamsWithWorkspace<{ userUUID: string }> &
                Body<UserType> &
                QueryStrings
        >,
        reply: FastifyReply,
    ): Promise<UserType> {
        try {
            await this.processRequest(request);

            if (!this.getPermissions().can("update", this.model)) {
                throw this.error("Unauthorized", 403);
            }

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
                    ({ records }) => {
                        if (records.length === 0) {
                            throw this.error("User not found", 404);
                        }

                        const [first] = records;

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
        request: FastifyRequest<
            ParamsWithWorkspace<{ userUUID: string }> &
                Body<UserType> &
                QueryStrings
        >,
        reply: FastifyReply,
    ): Promise<boolean> {
        try {
            await this.processRequest(request);

            if (!this.getPermissions().can("delete", this.model)) {
                throw this.error("Unauthorized", 403);
            }

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
                        throw this.error("User not found", 404);
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
                throw this.error("Could not delete user", 500);
            }
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
        request: FastifyRequest<
            ParamsWithWorkspace<{ userUUID: string }> &
                Body<UserType> &
                QueryStrings
        >,
        reply: FastifyReply,
    ): Promise<UserType[]> {
        try {
            await this.processRequest(request);

            if (!this.getPermissions().can("read", this.model)) {
                throw this.error("Unauthorized", 403);
            }

            const { limit, offset } = this.getQueryStrings(request);
            await this.model.validateNumber(limit);
            await this.model.validateNumber(offset);

            const { cypher, params } = this.query
                .list({
                    limit,
                    offset,
                    labels: "User",
                })
                .build();

            return reply.send(
                this.processList(
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
     * @returns An array of UserType instances.
     */
    protected processList(
        list: Array<UserType | null | undefined>,
    ): Array<UserType> {
        return list
            .filter(
                (user): user is UserType => user !== null && user !== undefined,
            )
            .map((user) => new User(this.model.mdorim, user).get() as UserType);
    }
}
