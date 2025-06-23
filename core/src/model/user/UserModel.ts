import { compare, hash } from "bcryptjs";

import { SALT_ROUNDS } from "@/constants";

import AbstractModel from "@/model/AbstractModel";

import { isMdorimError, User } from "@elucidario/mdorim";
import Core from "@/Core";

/**
 * # UserModel
 * The UserModel class provides methods to interact with the User entity in the database.
 */
export class UserModel extends AbstractModel<User> {
    static constraints: string[] = [
        "CREATE CONSTRAINT UserUniqueUUID IF NOT EXISTS\
        FOR (u:User)\
        REQUIRE u.uuid IS UNIQUE",
        "CREATE CONSTRAINT UserUniqueUsername IF NOT EXISTS\
        FOR (u:User)\
        REQUIRE u.username IS UNIQUE",
        "CREATE CONSTRAINT UserUniqueEmail IF NOT EXISTS\
        FOR (u:User)\
        REQUIRE u.email IS UNIQUE",
    ];

    constructor(core: Core) {
        super("/core/User", core);
    }

    /**
     * Creates a new user in the database.
     * @param email - The user's email address.
     * @param password - The user's password.
     * @param username - The user's username.
     * @returns The created user.
     * @throws MdorimError if the user is invalid or creation fails.
     */
    async create({ email, password, username }: Partial<User>): Promise<User> {
        try {
            await this.validateEntity({ email, password, username });
            await this.validateEmail(email);
            await this.validateUsername(username);
            await this.validatePassword(password);

            const encrypted = await hash(password!, SALT_ROUNDS);

            // create the query
            const { cypher, params } = this.queryCreate(
                {
                    email,
                    username,
                    password: encrypted,
                },
                "User",
            ).build();

            // write to the database
            return await this.core.graph.executeQuery<User>(
                (response) => {
                    if (response.records.length === 0) {
                        throw this.error("User not created");
                    }

                    const [first] = response.records;

                    return this.parseResponse<User>(first.get("u").properties);
                },
                cypher,
                params,
            );
        } catch (e: unknown) {
            throw this.error(e, {
                mdorim: {
                    ConstraintValidationFailed: {
                        message: "Email address already in use",
                        details: {
                            email: "Email address already in use",
                        },
                    },
                },
            });
        }
    }

    /**
     * Reads a user from the database.
     * @param id - The user's ID.
     * @returns The user, or null if not found.
     * @throws MdorimError if the user is invalid or reading fails.
     */
    async read(id: string): Promise<User | null> {
        try {
            await this.validateUUID(id);

            const { cypher, params } = this.queryRead(
                { uuid: id },
                "User",
            ).build();

            return await this.core.graph.executeQuery<User | null>(
                (response) => {
                    if (response.records.length === 0) {
                        return null;
                    }

                    const [first] = response.records;

                    return this.parseResponse<User>(first.get("u").properties);
                },
                cypher,
                params,
            );
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
    async update(id: string, args: Partial<User>): Promise<User> {
        try {
            await this.validateUUID(id);
            await this.validateEntity(args);

            const { cypher, params } = this.queryUpdate(
                id,
                args,
                "User",
            ).build();

            return await this.core.graph.executeQuery<User>(
                (response) => {
                    if (response.records.length === 0) {
                        throw this.error("User not found");
                    }

                    const [first] = response.records;

                    return this.parseResponse<User>(first.get("u").properties);
                },
                cypher,
                params,
            );
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Deletes a user from the database.
     * @param id - The user's ID.
     * @returns true if the user was deleted, false otherwise.
     * @throws MdorimError if the user is invalid or deletion fails.
     */
    async delete(id: string) {
        try {
            await this.validateUUID(id);

            const { cypher, params } = this.queryDelete(id, "User").build();

            return await this.core.graph.executeQuery<boolean>(
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
    async list(limit?: number, offset?: number): Promise<User[]> {
        try {
            await this.validateNumber(limit);
            await this.validateNumber(offset);

            const { cypher, params } = this.queryList(
                limit,
                offset,
                "User",
            ).build();

            return await this.core.graph.executeQuery<User[]>(
                (response) => {
                    const { records } = response;

                    if (records.length === 0) {
                        return [];
                    }

                    return records.map((record) => {
                        return this.parseResponse<User>(
                            record.get("u").properties,
                        );
                    });
                },
                cypher,
                params,
            );
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Retrieves a user by email.
     * @param email - The user's email address.
     * @throws MdorimError if the email is invalid or not found.
     * @returns The user, or null if not found.
     */
    async getByEmail(email: string): Promise<User | null> {
        try {
            await this.validateEmail(email);

            const { cypher, params } = this.queryRead(
                { email },
                "User",
            ).build();

            return await this.core.graph.executeQuery<User | null>(
                (response) => {
                    if (response.records.length === 0) {
                        return null;
                    }

                    const [first] = response.records;
                    return this.parseResponse<User>(first.get("u").properties);
                },
                cypher,
                params,
            );
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Retrieves a user by username.
     * @param username - The user's username.
     * @throws MdorimError if the username is invalid or not found.
     * @returns The user, or null if not found.
     */
    async getByUsername(username: string): Promise<User | null> {
        try {
            await this.validateUsername(username);

            const { cypher, params } = this.queryRead(
                { username },
                "User",
            ).build();

            return await this.core.graph.executeQuery<User | null>(
                (response) => {
                    if (response.records.length === 0) {
                        return null;
                    }

                    const [first] = response.records;
                    return this.parseResponse<User>(first.get("u").properties);
                },
                cypher,
                params,
            );
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Verify the login credentials of a user.
     * @param username - The user's username.
     * @param password - The user's password.
     * @returns The user if the credentials are valid.
     * @throws MdorimError if the credentials are invalid.
     */
    async verifyLogin(username: unknown, password: unknown): Promise<User> {
        try {
            await this.validateUsername(username);
            await this.validatePassword(password);

            const { cypher, params } = this.queryRead(
                {
                    username: username as string,
                },
                "User",
            ).build();

            const user = await this.core.graph.executeQuery(
                (response) => {
                    if (response.records.length === 0) {
                        return null;
                    }

                    const [first] = response.records;
                    return first.get("u").properties as User & {
                        password: string;
                    };
                },
                cypher,
                params,
            );

            if (!user) {
                throw this.error("Invalid username");
            }

            const valid = await compare(password as string, user.password);

            if (!valid) {
                throw this.error("Invalid username or password");
            } else {
                return this.parseResponse<User>(user);
            }
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Validates username against the string schema.
     * @param username - username to validate
     * @returns true if the username is valid, throws an MdorimError if it is not
     * @throws MdorimError
     */
    async validateUsername(username: unknown): Promise<true> {
        try {
            const isValid = await this.core.mdorim.validate(
                "/core/Definitions#/$defs/username",
                username,
            );

            if (isMdorimError(isValid)) {
                throw isValid;
            }

            return isValid;
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * Validates email against the string schema.
     * @param email - email to validate
     * @returns true if the email is valid, throws an MdorimError if it is not
     * @throws MdorimError
     */
    async validatePassword(password: unknown): Promise<true> {
        try {
            const isValid = await this.core.mdorim.validate(
                "/core/Definitions#/$defs/password",
                password,
            );

            if (isMdorimError(isValid)) {
                throw isValid;
            }

            return isValid;
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * Parses the response from the database to a User object.
     * @param data - The raw data from the database.
     * @returns A User object.
     */
    parseResponse<User>(data: Record<string, unknown>): User {
        return super.parseResponse(data, ["password"]);
    }
}
