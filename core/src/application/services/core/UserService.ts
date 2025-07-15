import { RawRuleOf, MongoAbility } from "@casl/ability";

import { Hooks, AuthContext, ListParams } from "@/types";
import { User as UserType, UUID } from "@elucidario/mdorim";
import { UserQuery } from "@/application/queries/core";
import { Graph } from "@/application/Graph";

import AService from "../AService";
import { User } from "@/domain/models/core";
import { Validator } from "@/application/Validator";
import { Auth } from "@/application/auth/Auth";

/**
 * # UserService
 * This service class provides methods to manage users in the application.
 * It extends the AService class and implements methods for creating,
 * reading, updating, deleting, and listing users.
 */
export class UserService extends AService<UserType, UserQuery> {
    /**
     * # UserService constructor
     * @param model - The user model
     * @param query - The user query
     * @param graph - The graph database instance
     * @param hooks - The service hooks
     * @param fastify - The Fastify instance
     */
    constructor(
        protected validator: Validator,
        protected query: UserQuery,
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
    async create(data: Partial<UserType>): Promise<UserType> {
        try {
            const model = new User();
            this.validator.setModel(model);

            await this.validator.validateEntity({ data });
            await this.validator.validateEmail(data.email);
            await this.validator.validateUsername(data.username);

            const node = "user";
            const { cypher, params } = this.query
                .create({
                    data,
                    labels: "User",
                    node,
                })
                .build();

            const user = await this.graph.writeTransaction(async (tx) => {
                const { records } = await tx.run(cypher, params);

                if (records.length === 0) {
                    throw this.error("User not created", 500);
                }

                const [first] = records;

                const user = this.graph.parseNode<UserType>(first.get(node));

                if (!user) {
                    throw this.error("User not created", 500);
                }

                await this.history(tx, "CREATE", user, user.uuid!);

                return user;
            });

            model.set(user);

            return model.get() as UserType;
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
    async read(data: Partial<UserType>): Promise<UserType | null> {
        try {
            const model = new User();

            if (!this.getPermissions().can("read", model)) {
                throw this.error("Unauthorized", 403);
            }

            this.validator.setModel(model);
            await this.validator.validateEntity({ data });

            const { cypher, params } = this.query
                .read({
                    data,
                    labels: "User",
                })
                .build();

            model.set(
                await this.graph.executeQuery<UserType>(
                    (response) => {
                        if (response.records.length === 0) {
                            throw this.error("User not found", 404);
                        }

                        const [first] = response.records;

                        const user = this.graph.parseNode<UserType>(
                            first.get("u"),
                        );

                        if (!user) {
                            throw this.error("User not found", 404);
                        }

                        return user;
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
     * Updates a user in the database.
     * @param id - The user's ID.
     * @param args - The fields to update.
     * @returns The updated user.
     * @throws MdorimError if the user is invalid or update fails.
     */
    async update(userUUID: UUID, data: Partial<UserType>): Promise<UserType> {
        try {
            const model = new User();
            if (!this.getPermissions().can("update", model)) {
                throw this.error("Unauthorized", 403);
            }

            this.validator.setModel(model);
            await this.validator.validateUUID(userUUID);
            await this.validator.validateEntity({ data });

            const { cypher, params } = this.query
                .update({
                    uuid: userUUID,
                    data,
                    labels: "User",
                })
                .build();

            const user = await this.graph.writeTransaction(async (tx) => {
                const res = await tx.run(cypher, params);
                if (res.records.length === 0) {
                    throw this.error("User not found.", 404);
                }
                const [first] = res.records;

                const user = this.graph.parseNode<UserType>(first.get("u"));

                if (!user) {
                    throw this.error("User not found.", 404);
                }

                await this.history(tx, "UPDATE", {
                    type: user.type,
                    uuid: user.uuid,
                    ...data
                }, user.uuid!);

                return user;
            });

            model.set(user);

            return model.get() as UserType;
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
    async delete(userUUID: UUID): Promise<boolean> {
        try {
            const model = new User();
            if (!this.getPermissions().can("delete", model)) {
                throw this.error("Unauthorized", 403);
            }

            this.validator.setModel(model);
            await this.validator.validateUUID(userUUID);

            const user = await this.read({ uuid: userUUID });
            if (!user) {
                throw this.error("User not found", 404);
            }

            const { cypher, params } = this.query
                .delete({
                    uuid: userUUID,
                    labels: "User",
                })
                .build();

            const removed = await this.graph.writeTransaction(async (tx) => {
                const res = await tx.run(cypher, params);
                if (res.records.length === 0) {
                    throw this.error("User not found", 404);
                }
                const [first] = res.records;

                const removed = first.get("removed") as boolean;

                if (!removed) {
                    throw this.error("Could not delete user", 500);
                }

                await this.history(tx, "DELETE", user, user.uuid!);

                return removed;
            });

            if (removed) {
                model.set(undefined);
                return true;
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
    async list(args?: ListParams): Promise<UserType[] | []> {
        try {
            const model = new User();
            if (!this.getPermissions().can("read", model)) {
                throw this.error("Unauthorized", 403);
            }

            this.validator.setModel(model);
            await this.validator.validateNumber(args?.limit);
            await this.validator.validateNumber(args?.offset);

            const { cypher, params } = this.query
                .list({
                    limit: args?.limit,
                    offset: args?.offset,
                    labels: "User",
                })
                .build();

            return this.processList(
                await this.graph.executeQuery<UserType[] | []>(
                    (response) => {
                        const { records } = response;

                        if (records.length === 0) {
                            return [];
                        }

                        return records.map((record) => {
                            return this.graph.parseNode<UserType>(
                                record.get("u"),
                            ) as UserType;
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
            .map((user) => new User(user).get() as UserType);
    }
}
