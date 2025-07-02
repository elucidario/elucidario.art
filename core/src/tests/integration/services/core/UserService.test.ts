import { afterAll, beforeAll, describe, expect, it, test } from "vitest";

import { lcdr } from "@/app";
import { User } from "@elucidario/mdorim";

describe("UserService", { skip: false }, async () => {
    const testUser = {
        email: "testador@example.com.br",
        username: "username_testador",
    };
    let user: User;

    const adminUser = {
        email: "admin@example.com",
        username: "username_admin",
    };

    beforeAll(async () => {
        const app = await lcdr(false);
        await app.inject({
            method: "POST",
            url: "/api/v1/users/register",
            payload: adminUser,
        });
    });

    afterAll(async () => {
        const app = await lcdr(false);
        const graph = app.lcdr.graph;

        await graph.writeTransaction(async (tx) => {
            return await tx.run("MATCH (n) DETACH DELETE n");
        });

        app.close();
    });

    it("should be defined", async () => {
        const app = await lcdr(false);
        expect(app).toBeDefined();
        expect(app.services.user).toBeDefined();
    });

    describe("CREATE", async () => {
        it("should create user", async () => {
            const app = await lcdr(false);
            const response = await app.inject({
                method: "POST",
                url: "/api/v1/users/register",
                payload: testUser,
            });

            expect(response.statusCode).toBe(201);
            expect(response.json()).toHaveProperty("email", testUser.email);
            expect(response.json()).toHaveProperty(
                "username",
                testUser.username,
            );

            user = response.json() as User;
        });

        describe("should return Errors", async () => {
            test("if user already exists", async () => {
                const app = await lcdr(false);
                const response = await app.inject({
                    method: "POST",
                    url: "/api/v1/users/register",
                    payload: testUser,
                });
                expect(response.statusCode).toBe(409);
            });

            test("if email is undefined", async () => {
                const app = await lcdr(false);
                const response = await app.inject({
                    method: "POST",
                    url: "/api/v1/users/register",
                    payload: {
                        username: "testuser",
                    },
                });
                expect(response.statusCode).toBe(400);
            });

            test("if username is undefined", async () => {
                const app = await lcdr(false);
                const response = await app.inject({
                    method: "POST",
                    url: "/api/v1/users/register",
                    payload: {
                        email: "testuser@example.com",
                    },
                });
                expect(response.statusCode).toBe(400);
            });

            test("if email is not a valid email", async () => {
                const app = await lcdr(false);
                const response = await app.inject({
                    method: "POST",
                    url: "/api/v1/users/register",
                    payload: {
                        email: "invalid-email",
                        username: "testuser",
                    },
                });
                expect(response.statusCode).toBe(400);
            });
        });
    });

    describe("READ", async () => {
        it("should get return a user", async () => {
            const app = await lcdr(false);
            const response = await app.inject({
                method: "GET",
                url: `/api/v1/users/profile/${user.uuid}`,
            });

            expect(response.statusCode).toBe(200);
            const foundUser = response.json() as User;

            expect(foundUser).toBeDefined();
            expect(foundUser).toHaveProperty("uuid", user.uuid);
            expect(foundUser).toHaveProperty("email", testUser.email);
            expect(foundUser).toHaveProperty("username", testUser.username);
            expect(foundUser).not.toHaveProperty("password");
        });

        it("should list users", async () => {
            const app = await lcdr(false);
            const response = await app.inject({
                method: "GET",
                url: "/api/v1/users",
            });

            expect(response.statusCode).toBe(200);
            const users = response.json() as User[];

            expect(users).toBeDefined();
            expect(users.length).toBeGreaterThan(0);
            expect(users[0]).toHaveProperty("uuid");
            expect(users[0]).toHaveProperty("email");
            expect(users[0]).toHaveProperty("username");
        });
    });

    describe("UPDATE", async () => {
        it("should update a user", async () => {
            const app = await lcdr(false);
            const newUsername = "newusername";
            const response = await app.inject({
                method: "PUT",
                url: `/api/v1/users/profile/${user.uuid}`,
                payload: {
                    username: newUsername,
                },
            });

            expect(response.statusCode).toBe(200);
            const updatedUser = response.json() as User;

            expect(updatedUser).toBeDefined();
            expect(updatedUser).toHaveProperty("uuid", user.uuid);
            expect(updatedUser).toHaveProperty("email", testUser.email);
            expect(updatedUser).toHaveProperty("username", newUsername);
        });

        describe("should return error on update method", () => {
            test("if invalid uuid", async () => {
                const app = await lcdr(false);
                const response = await app.inject({
                    method: "PUT",
                    url: `/api/v1/users/profile/invalid-uuid`,
                    payload: {
                        username: "newusername",
                        email: "banana@example.com",
                    },
                });
                expect(response.statusCode).toBe(400);
            });

            test("if user does not exist", async () => {
                const app = await lcdr(false);
                const response = await app.inject({
                    method: "PUT",
                    url: `/api/v1/users/profile/81f73922-e39b-4ba1-a544-59201d1da319`,
                    payload: {
                        username: "newusername",
                        email: "banana@example.com",
                    },
                });

                expect(response.statusCode).toBe(404);
            });
        });
    });

    describe("DELETE", async () => {
        it("should delete a user", async () => {
            const app = await lcdr(false);

            const response = await app.inject({
                method: "DELETE",
                url: `/api/v1/users/${user.uuid}`,
                payload: {},
            });

            expect(response.statusCode).toBe(204);
        });
    });
});
