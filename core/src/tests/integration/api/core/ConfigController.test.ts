import { describe, expect, it, vi } from "vitest";

import { lcdr } from "@/http";
import { testSetup } from "@/tests/setup";

import { beforeEach } from "node:test";
import { ServiceError } from "@/domain/errors";

const { mockSetContext, mockSetMainConfig, mockGetMainConfig, mockAuthenticateRequest } = vi.hoisted(
    () => ({
        mockSetContext: vi.fn(),
        mockSetMainConfig: vi.fn(),
        mockGetMainConfig: vi.fn(),
        mockAuthenticateRequest: vi.fn(),
    }),
);

vi.mock("../../../../application/services/core/ConfigService", () => {
    const ConfigServiceMock = vi.fn().mockImplementation(() => ({
        setContext: mockSetContext,
        setMainConfig: mockSetMainConfig,
        getMainConfig: mockGetMainConfig,
    }));
    return { ConfigService: ConfigServiceMock };
});

vi.mock("../../../../application/auth/Auth", () => {
    return {
        Auth: vi.fn().mockImplementation(() => ({
            authenticateRequest: mockAuthenticateRequest,
        })),
    };
});

describe("ConfigController", { skip: true }, async () => {
    const adminUser = {
        type: "User",
        email: "admin@example.com",
        username: "username123",
    };
    const payload = {
        type: "MainConfig",
        sysadmins: [adminUser],
    };

    beforeEach(() => {
        mockSetContext.mockClear();
        mockSetMainConfig.mockClear();
        mockGetMainConfig.mockClear();
        mockAuthenticateRequest.mockClear();
    });

    describe("CREATE", testSetup.CREATE, async () => {
        it("should create main config", async () => {
            const app = await lcdr(false);

            const mockResponse = {
                data: payload,
            };
            mockSetMainConfig.mockResolvedValue(mockResponse.data);

            const response = await app.inject({
                method: "POST",
                url: "/api/v1/config",
                payload,
            });

            const config = response.json();

            expect(response.statusCode).toBe(201);
            expect(config).toEqual(mockResponse);
            expect(mockSetMainConfig).toHaveBeenCalledWith(payload);
            expect(mockSetMainConfig).toHaveBeenCalledTimes(1);
        });

        it("should return error if main config already exists", async () => {
            const app = await lcdr(false);

            mockSetMainConfig.mockRejectedValue(
                new ServiceError("Main config already exists.", 401),
            );

            const response = await app.inject({
                method: "POST",
                url: "/api/v1/config",
                payload,
            });

            expect(response.statusCode).toBe(401);
            expect(response.json()).toEqual({
                error: "Unauthorized",
                message: "Main config already exists.",
                statusCode: 401,
            });
        });
    });

    describe("READ", testSetup.READ, async () => {
        it("should return error with la-profile", async () => {
            const app = await lcdr(false);

            mockGetMainConfig.mockResolvedValue(payload);

            mockAuthenticateRequest.mockResolvedValue({
                user: adminUser,
                workspace: { uuid: "workspace-uuid" },
            });

            const response = await app.inject({
                method: "GET",
                url: "/api/v1/config",
                headers: {
                    Accept: 'application/ld+json;profile="https://linked.art/ns/v1/linked-art.json"',
                },
            });

            expect(response.statusCode).toBe(406);
            expect(response.json()).toEqual({
                error: "Not Acceptable",
                message:
                    "Linked Art profile is not accepted for Config endpoint.",
                statusCode: 406,
            });
        });

        it("should read MainConfig with default profile", async () => {
            const app = await lcdr(false);

            mockSetContext.mockResolvedValue({
                user: adminUser,
                workspace: { uuid: "workspace-uuid" },
            });
            mockGetMainConfig.mockResolvedValue(payload);

            const response = await app.inject({
                method: "GET",
                url: "/api/v1/config",
            });

            const config = response.json();

            expect(response.statusCode).toBe(200);
            expect(config.data).toEqual(payload);
            expect(mockGetMainConfig).toHaveBeenCalledTimes(1);
        });
    });
});
