import { afterAll, beforeAll, describe, expect, it, test } from "vitest";

import {
    DefaultLocale,
    I18n,
    Mdorim,
    User as UserType,
} from "@elucidario/mdorim";
import { testSetup } from "@/tests/setup";
import Core from "@/Core";
import { ConfigService, UserService } from "@/application/services";
import { Validator } from "@/application/Validator";
import { ConfigQuery, UserQuery } from "@/application/queries/core";

describe("UserService", { skip: false }, async () => {
    let lcdr: Core;
    let service: UserService;

    const testUser = {
        email: "testador@example.com.br",
        username: "username_testador",
    };

    let user: UserType;

    const adminUser = {
        type: "User" as const,
        email: "admin@example.com",
        username: "username_admin",
    };

    beforeAll(async () => {
        lcdr = new Core();
        service = new UserService(
            new Validator(new Mdorim(new I18n(DefaultLocale))),
            new UserQuery(lcdr.cypher),
            lcdr.authorization,
            lcdr.graph,
            lcdr.hooks,
        );
        await lcdr.setup();

        await lcdr.graph.writeTransaction(async (tx) => {
            await tx.run("MATCH (u:User {email: $email}) DETACH DELETE u", {
                email: adminUser.email,
            });

            await tx.run("MATCH (u:User {email: $email}) DETACH DELETE u", {
                email: testUser.email,
            });
        });

        const config = new ConfigService(
            new Validator(new Mdorim(new I18n(DefaultLocale))),
            new ConfigQuery(lcdr.cypher),
            lcdr.authorization,
            lcdr.graph,
            lcdr.hooks,
        );
        await config.setMainConfig({
            type: "MainConfig",
            sysadmins: [adminUser],
        });
    });

    afterAll(async () => {
        if (!testSetup.DELETE.skip) {
            await lcdr.graph.writeTransaction(async (tx) => {
                await tx.run("MATCH (u:User {email: $email}) DETACH DELETE u", {
                    email: adminUser.email,
                });

                await tx.run("MATCH (u:User {email: $email}) DETACH DELETE u", {
                    email: testUser.email,
                });

                await tx.run("MATCH (m:MainConfig) DETACH DELETE m");
            });
        } else {
            console.log(
                "Skipping DELETE afterAll operations as per test setup configuration.",
            );
        }

        await lcdr.close();
    });

    it("should be defined", async () => {
        expect(service).toBeDefined();
    });

    describe("CREATE", testSetup.CREATE, async () => {
        it("should create user", async () => {
            service.setContext({
                user,
                role: "admin",
            });
            user = await service.create(testUser);

            expect(user).toHaveProperty("email", testUser.email);
            expect(user).toHaveProperty("username", testUser.username);
        });

        describe("should throw Errors", async () => {
            test("if user already exists", async () => {
                await expect(async () =>
                    service.create(testUser),
                ).rejects.toThrow("Entity already exists.");
            });

            test("if email is undefined", async () => {
                await expect(async () =>
                    service.create({
                        username: "testuser",
                    }),
                ).rejects.toThrow("MdorimError: Validation failed");
            });

            test("if username is undefined", async () => {
                await expect(async () =>
                    service.create({
                        email: "test@example.com",
                    }),
                ).rejects.toThrow("MdorimError: Validation failed");
            });

            test("if email is not a valid email", async () => {
                await expect(async () =>
                    service.create({
                        email: "invalid-email",
                        username: "testuser",
                    }),
                ).rejects.toThrow("MdorimError: Validation failed");

                // const app = await lcdr(false);
                // const response = await app.inject({
                //     method: "POST",
                //     url: "/api/v1/users/register",
                //     payload: {
                //         email: "invalid-email",
                //         username: "testuser",
                //     },
                // });
                // expect(response.statusCode).toBe(400);
            });
        });
    });

    describe("READ", testSetup.READ, async () => {
        it("should return a user", async () => {
            const foundUser = await service.read({ uuid: user.uuid! });

            expect(foundUser).toBeDefined();
            expect(foundUser).toHaveProperty("uuid", user.uuid);
            expect(foundUser).toHaveProperty("email", testUser.email);
            expect(foundUser).toHaveProperty("username", testUser.username);
            expect(foundUser).not.toHaveProperty("password");
        });

        it("should list users", async () => {
            const users = await service.list();

            expect(users).toBeDefined();
            expect(users.length).toBeGreaterThan(0);
            expect(users[0]).toHaveProperty("uuid");
            expect(users[0]).toHaveProperty("email");
            expect(users[0]).toHaveProperty("username");
        });
    });

    describe("UPDATE", testSetup.UPDATE, async () => {
        it("should update a user", async () => {
            const newUsername = "newusername";
            const updatedUser = await service.update(user.uuid!, {
                username: newUsername,
            });

            expect(updatedUser).toBeDefined();
            expect(updatedUser).toHaveProperty("uuid", user.uuid);

            expect(updatedUser).toBeDefined();
            expect(updatedUser).toHaveProperty("uuid", user.uuid);
            expect(updatedUser).toHaveProperty("email", testUser.email);
            expect(updatedUser).toHaveProperty("username", newUsername);
        });

        describe("should return error on update method", () => {
            test("if invalid uuid", async () => {
                await expect(async () =>
                    service.update("invalid-uuid", { username: "newusername" }),
                ).rejects.toThrow("MdorimError: Validation failed");
            });

            test("if user does not exist", async () => {
                await expect(async () =>
                    service.update("f8059152-ed4c-4a07-a6bf-9cdc6826fd6f", {
                        username: "newusername",
                        type: "User",
                    }),
                ).rejects.toThrow("User not found.");
            });
        });
    });

    describe("DELETE", testSetup.DELETE, async () => {
        it("should delete a user", async () => {
            const deletedUser = await service.delete(user.uuid!);

            expect(deletedUser).toBe(true);
        });
    });
});
