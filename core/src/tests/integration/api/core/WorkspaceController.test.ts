import { describe, expect, it, vi } from "vitest";

import { lcdr } from "@/http";
import { testSetup } from "@/tests/setup";
import { beforeEach } from "node:test";

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

vi.mock("../../../../application/services/core/WorkspaceService", () => {
    const WorkspaceServiceMock = vi.fn().mockImplementation(() => ({
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete,
        read: mockRead,
        list: mockList,
        setContext: mockSetContext,
    }));
    return { WorkspaceService: WorkspaceServiceMock };
});

vi.mock("../../../../application/auth/Auth", () => {
    return {
        Auth: vi.fn().mockImplementation(() => ({
            authenticateRequest: mockAuthenticateRequest,
        })),
    };
});

describe("WorkspaceController", { skip: true }, async () => {
    beforeEach(() => {
        mockCreate.mockClear();
        mockUpdate.mockClear();
        mockDelete.mockClear();
        mockRead.mockClear();
        mockList.mockClear();
        mockAuthenticateRequest.mockClear();
        mockSetContext.mockClear();
    });

    describe("CREATE", testSetup.CREATE, async () => {
        it("should create a workspace", async () => {
            const app = await lcdr(false);

            mockCreate.mockResolvedValue({
                name: "Test Workspace from WorkspaceModel.test",
                uuid: "test-uuid-1234",
            });

            const response = await app.inject({
                method: "POST",
                url: "/api/v1/workspaces",
                payload: {
                    name: "Test Workspace from WorkspaceModel.test",
                },
            });

            expect(response.statusCode).toBe(201);
            expect(mockCreate).toHaveBeenCalledWith({
                name: "Test Workspace from WorkspaceModel.test",
            });
            const createdWorkspace = response.json();

            expect(createdWorkspace.data).toBeDefined();
            expect(createdWorkspace.data.name).toBe(
                "Test Workspace from WorkspaceModel.test",
            );

            expect(mockCreate).toHaveBeenCalledTimes(1);
        });
    });

    describe("READ", testSetup.READ, async () => {
        it("should read a workspace by ID", async () => {
            const app = await lcdr(false);

            mockRead.mockResolvedValue({
                name: "Test Workspace from WorkspaceModel.test",
                uuid: "uuid-test-1234",
            });

            const response = await app.inject({
                method: "GET",
                url: `/api/v1/workspaces/uuid-test-1234`,
            });

            expect(response.statusCode).toBe(200);
            const readWorkspace = response.json();
            expect(readWorkspace.data).toBeDefined();
            expect(readWorkspace.data.name).toBe(
                "Test Workspace from WorkspaceModel.test",
            );

            expect(mockRead).toHaveBeenCalledWith({ uuid: "uuid-test-1234" });
            expect(mockRead).toHaveBeenCalledTimes(1);
        });

        it("should list all workspaces", async () => {
            const app = await lcdr(false);

            mockList.mockResolvedValue([
                {
                    name: "Workspace 1",
                    uuid: "workspace-1-uuid",
                },
                {
                    name: "Workspace 2",
                    uuid: "workspace-2-uuid",
                },
            ]);

            const response = await app.inject({
                method: "GET",
                url: "/api/v1/workspaces",
            });

            expect(response.statusCode).toBe(200);
            const workspaces = response.json();
            expect(workspaces.data).toBeDefined();
            expect(workspaces.data.length).toBe(2);
            expect(workspaces.data[0].name).toBe("Workspace 1");
            expect(workspaces.data[1].name).toBe("Workspace 2");

            expect(mockList).toHaveBeenCalledWith({});
            expect(mockList).toHaveBeenCalledTimes(1);
        });
    });

    describe("UPDATE", testSetup.UPDATE, async () => {
        it("should update a workspace", async () => {
            const updatedWorkspace = {
                name: "Updated Workspace Name",
                description: "Updated description for the workspace.",
            };

            const app = await lcdr(false);

            mockUpdate.mockResolvedValue({
                ...updatedWorkspace,
                uuid: "workspace-uuid-1234",
            });

            const response = await app.inject({
                method: "PUT",
                url: `/api/v1/workspaces/workspace-uuid-1234`,
                payload: updatedWorkspace,
            });

            expect(response.statusCode).toBe(200);
            const readWorkspace = response.json();

            expect(readWorkspace.data).toBeDefined();
            expect(readWorkspace.data.name).toBe("Updated Workspace Name");
            expect(readWorkspace.data.description).toBe(
                "Updated description for the workspace.",
            );

            expect(mockUpdate).toHaveBeenCalledWith(
                "workspace-uuid-1234",
                updatedWorkspace,
            );
            expect(mockUpdate).toHaveBeenCalledTimes(1);
        });
    });

    describe("DELETE", testSetup.DELETE, async () => {
        it("should delete a workspace", async () => {
            const app = await lcdr(false);

            mockDelete.mockResolvedValue({
                success: true,
                message: "Workspace deleted successfully.",
            });

            const response = await app.inject({
                method: "DELETE",
                url: `/api/v1/workspaces/workspace-uuid-1234`,
            });
            expect(response.statusCode).toBe(204);
            expect(mockDelete).toHaveBeenCalledWith("workspace-uuid-1234");
            expect(mockDelete).toHaveBeenCalledTimes(1);
        });
    });
});
