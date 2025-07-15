import { beforeEach, describe, expect, it, test, vi } from "vitest";

import { lcdr } from "@/http";
import { testSetup } from "@/tests/setup";
import { ControllerError } from "@/domain/errors";

const {
    mockCreate,
    mockUpdate,
    mockDelete,
    mockRead,
    mockList,
    mockAuthenticateRequest,
    mockSetContext,
} = vi.hoisted(() => ({
    mockCreate: vi.fn(),
    mockUpdate: vi.fn(),
    mockDelete: vi.fn(),
    mockRead: vi.fn(),
    mockList: vi.fn(),
    mockAuthenticateRequest: vi.fn(),
    mockSetContext: vi.fn(),
}));

vi.mock("../../../../application/services/core/UserService", () => {
    const UserServiceMock = vi.fn().mockImplementation(() => ({
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete,
        read: mockRead,
        list: mockList,
        setContext: mockSetContext,
    }));
    return { UserService: UserServiceMock };
});

vi.mock("../../../../application/auth/Auth", () => {
    return {
        Auth: vi.fn().mockImplementation(() => ({
            authenticateRequest: mockAuthenticateRequest,
        })),
    };
});

describe("UserController", { skip: true }, async () => {
    const testUser = {
        email: "testador@example.com.br",
        username: "username_testador",
    };

    beforeEach(() => {
        mockCreate.mockClear();
        mockUpdate.mockClear();
        mockDelete.mockClear();
        mockRead.mockClear();
        mockList.mockClear();
        mockAuthenticateRequest.mockClear();
    });

    describe("CREATE", testSetup.CREATE, async () => {
        it("should create user", async () => {
            const app = await lcdr(false);

            const mockResponse = {
                data: testUser,
            };
            mockCreate.mockResolvedValue(mockResponse.data);

            const response = await app.inject({
                method: "POST",
                url: "/api/v1/users",
                payload: testUser,
            });

            expect(response.statusCode).toBe(201);
            const user = response.json();
            expect(user).toEqual(mockResponse);
            expect(mockCreate).toHaveBeenCalledWith(testUser);
            expect(mockCreate).toHaveBeenCalledTimes(1);
        });

        describe("should return Errors", async () => {
            test("if user already exists", async () => {
                const app = await lcdr(false);

                const mockResponse = new ControllerError(
                    "User already exists.",
                    409,
                );

                mockCreate.mockRejectedValue(mockResponse);

                const response = await app.inject({
                    method: "POST",
                    url: "/api/v1/users",
                    payload: testUser,
                });

                expect(response.statusCode).toBe(409);
            });

            test("if email is undefined", async () => {
                const app = await lcdr(false);

                const mockResponse = new ControllerError(
                    "Email is required.",
                    400,
                );

                mockCreate.mockRejectedValue(mockResponse);

                const response = await app.inject({
                    method: "POST",
                    url: "/api/v1/users",
                    payload: {
                        username: "testuser",
                    },
                });
                expect(response.statusCode).toBe(400);
            });

            test("if username is undefined", async () => {
                const app = await lcdr(false);

                const mockResponse = new ControllerError(
                    "Username is required.",
                    400,
                );

                mockCreate.mockRejectedValue(mockResponse);

                const response = await app.inject({
                    method: "POST",
                    url: "/api/v1/users",
                    payload: {
                        email: "testuser@example.com",
                    },
                });
                expect(response.statusCode).toBe(400);
            });

            test("if email is not a valid email", async () => {
                const app = await lcdr(false);

                const mockResponse = new ControllerError(
                    "Email is not a valid email.",
                    400,
                );

                mockCreate.mockRejectedValue(mockResponse);

                const response = await app.inject({
                    method: "POST",
                    url: "/api/v1/users",
                    payload: {
                        email: "invalid-email",
                        username: "testuser",
                    },
                });
                expect(response.statusCode).toBe(400);
            });
        });
    });

    describe("READ", testSetup.READ, async () => {
        describe("content-type application/json", () => {
            it("should return a user", async () => {
                const app = await lcdr(false);

                const mockResponse = {
                    data: {
                        uuid: "uuid-1234-5678-9012",
                        email: "testuser@example.com",
                        username: "testuser",
                    },
                };

                mockRead.mockResolvedValue(mockResponse.data);

                const response = await app.inject({
                    method: "GET",
                    url: `/api/v1/users/uuid-1234-5678-9012`,
                });

                expect(response.statusCode).toBe(200);

                const user = response.json();

                expect(user).toEqual(mockResponse);
                expect(mockRead).toHaveBeenCalledWith({
                    uuid: "uuid-1234-5678-9012",
                });
                expect(mockRead).toHaveBeenCalledTimes(1);
            });

            it("should list users", async () => {
                const app = await lcdr(false);

                const mockResponse = {
                    data: [
                        {
                            uuid: "uuid-1234-5678-9012",
                            email: "testuser@example.com",
                            username: "testuser",
                        },
                    ],
                };

                mockList.mockResolvedValue(mockResponse.data);

                const response = await app.inject({
                    method: "GET",
                    url: "/api/v1/users",
                });

                expect(response.statusCode).toBe(200);
            });
        });

        describe("content-type 'application/ld+json;profile=\"https://linked.art/ns/v1/linked-art.json\"'", () => {
            it("should return a Error as User is not a Linked-Art Entity for GET", async () => {
                const app = await lcdr(false);

                const response = await app.inject({
                    method: "GET",
                    url: `/api/v1/users/uuid-1234-5678-9012`,
                    headers: {
                        accept: "application/ld+json;profile=\"https://linked.art/ns/v1/linked-art.json\"",
                    },
                });

                expect(response.statusCode).toBe(400);
            })

            it("should return a Error as User is not a Linked-Art Entity for LIST", async () => {
                const app = await lcdr(false);

                const response = await app.inject({
                    method: "GET",
                    url: `/api/v1/users`,
                    headers: {
                        accept: "application/ld+json;profile=\"https://linked.art/ns/v1/linked-art.json\"",
                    },
                });

                expect(response.statusCode).toBe(400);
            })
        });
    });

    describe("UPDATE", testSetup.UPDATE, async () => {
        it("should update a user", async () => {
            const app = await lcdr(false);
            const newUsername = "newusername";

            const mockResponse = {
                data: {
                    uuid: "uuid-1234-5678-9012",
                    email: "testuser@example.com",
                    username: "testuser",
                },
            };

            mockUpdate.mockResolvedValue({
                ...mockResponse.data,
                ...{ username: newUsername },
            });

            const response = await app.inject({
                method: "PUT",
                url: `/api/v1/users/uuid-1234-5678-9012`,
                payload: {
                    username: newUsername,
                },
            });

            expect(response.statusCode).toBe(200);
            const user = response.json();

            expect(user).toMatchObject({
                ...mockResponse,
                ...{ data: { username: newUsername } },
            });
            expect(mockUpdate).toHaveBeenCalledWith("uuid-1234-5678-9012", {
                username: newUsername,
            });
            expect(mockUpdate).toHaveBeenCalledTimes(1);
        });

        describe("should return error on update method", () => {
            test("if invalid uuid", async () => {
                const app = await lcdr(false);

                const mockResponse = new ControllerError("Invalid UUID.", 400);

                mockUpdate.mockRejectedValue(mockResponse);

                const response = await app.inject({
                    method: "PUT",
                    url: `/api/v1/users/invalid-uuid`,
                    payload: {
                        username: "newusername",
                        email: "banana@example.com",
                    },
                });

                expect(response.statusCode).toBe(400);
            });

            test("if user does not exist", async () => {
                const app = await lcdr(false);

                const mockResponse = new ControllerError(
                    "User not found.",
                    404,
                );

                mockUpdate.mockRejectedValue(mockResponse);

                const response = await app.inject({
                    method: "PUT",
                    url: `/api/v1/users/81f73922-e39b-4ba1-a544-59201d1da319`,
                    payload: {
                        username: "newusername",
                        email: "banana@example.com",
                    },
                });

                expect(response.statusCode).toBe(404);
            });
        });
    });

    describe("DELETE", testSetup.DELETE, async () => {
        it("should delete a user", async () => {
            const app = await lcdr(false);

            const mockResponse = {
                data: {
                    uuid: "uuid-1234-5678-9012",
                    email: "testuser@example.com",
                    username: "testuser",
                },
            };

            mockDelete.mockResolvedValue(mockResponse.data);

            const response = await app.inject({
                method: "DELETE",
                url: `/api/v1/users/uuid-1234-5678-9012`,
                payload: {},
            });

            expect(response.statusCode).toBe(204);
        });
    });
});
