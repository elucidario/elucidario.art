import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import { User } from "@elucidario/mdorim";

import { UserModel } from "./UserModel";
import Core from "@/Core";

describe("UserModel", () => {
    let model: UserModel;

    let user: User;

    const testUser = {
        email: "testador@example.com.br",
        password: "password",
        username: "username123",
    };

    beforeAll(async () => {
        UserModel.register();
        model = new UserModel(Core.getInstance());
    });

    afterAll(async () => {
        const user = await model.getByEmail(testUser.email);
        if (user) {
            await model.delete(user.uuid);
        }
    });

    it("should be defined", () => {
        expect(model).toBeDefined();
    });

    test("should have a create method", () => {
        expect(model.create).toBeDefined();
        expect(typeof model.create).toBe("function");
    });

    test("should have a read method", () => {
        expect(model.read).toBeDefined();
        expect(typeof model.read).toBe("function");
    });

    test("should have an update method", () => {
        expect(model.update).toBeDefined();
        expect(typeof model.update).toBe("function");
    });

    test("should have a delete method", () => {
        expect(model.delete).toBeDefined();
        expect(typeof model.delete).toBe("function");
    });

    describe("CREATE", async () => {
        it("should create a user", async () => {
            user = await model.create(testUser);

            expect(user).toHaveProperty("uuid");
            expect(user).toHaveProperty("email");
            expect(user).toHaveProperty("username");
            expect(user).not.toHaveProperty("password");
        });

        describe("should throw", () => {
            test("if user already exists", async () => {
                await expect(
                    async () => await model.create(testUser),
                ).rejects.toThrow();
            });

            test("if email is undefined", async () => {
                await expect(
                    async () =>
                        await model.create({
                            email: undefined,
                            password: "password",
                            username: "name",
                        }),
                ).rejects.toThrow();
            });

            test("if username is undefined", async () => {
                await expect(
                    async () =>
                        await model.create({
                            email: "test@test.com",
                            password: "password",
                            username: undefined,
                        }),
                ).rejects.toThrow();
            });

            test("if password is undefined", async () => {
                await expect(
                    async () =>
                        await model.create({
                            email: "test@test.com",
                            password: undefined,
                            username: "username",
                        }),
                ).rejects.toThrow();
            });

            test("if email is not a valid email", async () => {
                await expect(
                    async () =>
                        await model.create({
                            email: "invalid-email",
                            password: "password",
                            username: "name",
                        }),
                ).rejects.toThrow();
            });
        });
    });

    describe("READ", async () => {
        it("should get a user by id", async () => {
            const userId = user.uuid;
            const foundUser = await model.read(userId);

            expect(foundUser).toBeDefined();
            expect(foundUser).toHaveProperty("uuid", userId);
            expect(foundUser).toHaveProperty("email", testUser.email);
            expect(foundUser).toHaveProperty("username", testUser.username);
            expect(foundUser).not.toHaveProperty("password");
        });

        it("should get a user by email", async () => {
            const foundUser = await model.getByEmail(testUser.email);

            expect(foundUser).toBeDefined();
            expect(foundUser).toHaveProperty("uuid", user.uuid);
            expect(foundUser).toHaveProperty("email", testUser.email);
            expect(foundUser).toHaveProperty("username", testUser.username);
            expect(foundUser).not.toHaveProperty("password");
        });

        it("should get a user by username", async () => {
            const foundUser = await model.getByUsername(testUser.username);

            expect(foundUser).toBeDefined();
            expect(foundUser).toHaveProperty("uuid", user.uuid);
            expect(foundUser).toHaveProperty("email", testUser.email);
            expect(foundUser).toHaveProperty("username", testUser.username);
            expect(foundUser).not.toHaveProperty("password");
        });

        it("should list users", async () => {
            const users = await model.list(10, 0);
            expect(users).toBeDefined();
            expect(users).toBeInstanceOf(Array);
        });
    });

    describe("VALIDATION", async () => {
        it("should validate login", async () => {
            const validLogin = await model.verifyLogin(
                testUser.username,
                testUser.password,
            );

            expect(validLogin).toBeDefined();
            expect(validLogin).toHaveProperty("uuid");
            expect(validLogin).toHaveProperty("email");
            expect(validLogin).toHaveProperty("username");
            expect(validLogin).not.toHaveProperty("password");
        });

        describe("should throw on verifyLogin method", () => {
            test("if username is undefined", async () => {
                await expect(
                    async () => await model.verifyLogin(undefined, "password"),
                ).rejects.toThrow();
            });

            test("if password is undefined", async () => {
                await expect(
                    async () => await model.verifyLogin("username", undefined),
                ).rejects.toThrow();
            });

            test("if user does not exist", async () => {
                await expect(
                    async () =>
                        await model.verifyLogin("nonexistentuser", "password"),
                ).rejects.toThrow();
            });

            test("if password is incorrect", async () => {
                await expect(
                    async () =>
                        await model.verifyLogin(
                            testUser.username,
                            "wrongpassword",
                        ),
                ).rejects.toThrow();
            });
        });
    });

    describe("UPDATE", async () => {
        it("should update a user", async () => {
            const updatedUser = await model.update(user.uuid, {
                username: "newusername",
            });

            expect(updatedUser).toBeDefined();
            expect(updatedUser).toHaveProperty("uuid", user.uuid);
            expect(updatedUser).toHaveProperty("email", testUser.email);
            expect(updatedUser).toHaveProperty("username", "newusername");
            expect(updatedUser).not.toHaveProperty("password");
        });

        describe("should throw on update method", () => {
            test("if user does not exist", async () => {
                await expect(
                    async () =>
                        await model.update("nonexistent-uuid", {
                            username: "newusername",
                        }),
                ).rejects.toThrow();
            });

            test("if username is undefined", async () => {
                await expect(
                    async () =>
                        await model.update(user.uuid, { username: undefined }),
                ).rejects.toThrow();
            });
        });
    });

    describe("DELETE", async () => {
        it("should delete a user", async () => {
            const userId = user.uuid;
            const remove = await model.delete(userId);
            expect(remove).toBeTruthy();
        });
    });
});
