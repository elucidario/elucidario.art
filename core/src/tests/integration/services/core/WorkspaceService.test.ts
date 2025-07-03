import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Workspace } from "@elucidario/mdorim";

import { lcdr } from "@/app";
import { FastifyInstance } from "fastify";
import { testSetup } from "@/tests/setup";

describe("WorkspaceService", async () => {
    let app: FastifyInstance;
    let workspace: Workspace;

    const adminUser = {
        email: "admin@example.com",
        username: "username_admin",
    };

    beforeAll(async () => {
        app = await lcdr(false);
        const graph = app.lcdr.graph;

        await graph.writeTransaction(async (tx) => {
            await tx.run("MATCH (u:User {email: $email}) DETACH DELETE u", {
                email: adminUser.email,
            });

            await tx.run("MATCH (m:MainConfig) DETACH DELETE m");

            await tx.run("MATCH (w:Workspace) DETACH DELETE w");
        });

        await app.inject({
            method: "POST",
            url: "/api/v1/config",
            payload: {
                type: "MainConfig",
                sysadmins: [adminUser],
            },
        });
    });

    afterAll(async () => {
        const graph = app.lcdr.graph;

        if (!testSetup.DELETE.skip) {
            await graph.writeTransaction(async (tx) => {
                await tx.run("MATCH (u:User {email: $email}) DETACH DELETE u", {
                    email: adminUser.email,
                });

                await tx.run("MATCH (m:MainConfig) DETACH DELETE m");

                await tx.run("MATCH (w:Workspace) DETACH DELETE w");
            });
        } else {
            console.log(
                "Skipping DELETE afterAll operations as per test setup configuration.",
            );
        }

        app.close();
    });

    it("should be defined", () => {
        expect(app).toBeDefined();
        expect(app.services.workspace).toBeDefined();
    });

    describe("CREATE", testSetup.CREATE, async () => {
        it("should create a workspace", async () => {
            const response = await app.inject({
                method: "POST",
                url: "/api/v1/workspaces",
                payload: {
                    name: "Test Workspace from WorkspaceModel.test",
                },
            });
            expect(response.statusCode).toBe(201);
            workspace = response.json() as Workspace;
            expect(workspace).toBeDefined();
            expect(workspace.name).toBe(
                "Test Workspace from WorkspaceModel.test",
            );
            expect(workspace.uuid).toBeDefined();
        });
    });

    describe("READ", testSetup.READ, async () => {
        it("should read a workspace by ID", async () => {
            const response = await app.inject({
                method: "GET",
                url: `/api/v1/workspaces/profile/${workspace.uuid}`,
            });

            expect(response.statusCode).toBe(200);
            const readWorkspace = response.json() as Workspace;
            expect(readWorkspace).toBeDefined();
            expect(readWorkspace.name).toBe(
                "Test Workspace from WorkspaceModel.test",
            );
        });

        it("should list all workspaces", async () => {
            const response = await app.inject({
                method: "GET",
                url: "/api/v1/workspaces",
            });

            expect(response.statusCode).toBe(200);
            const workspaces = response.json() as Workspace[];
            expect(workspaces).toBeDefined();
            expect(workspaces.length).toBeGreaterThan(0);
        });
    });

    describe("UPDATE", testSetup.UPDATE, async () => {
        it("should update a workspace", async () => {
            const updatedWorkspace = {
                name: "Updated Workspace Name",
                description: "Updated description for the workspace.",
            };

            const response = await app.inject({
                method: "PUT",
                url: `/api/v1/workspaces/profile/${workspace.uuid}`,
                payload: updatedWorkspace,
            });

            expect(response.statusCode).toBe(200);
            const readWorkspace = response.json() as Workspace;
            expect(readWorkspace).toBeDefined();
            expect(readWorkspace.name).toBe("Updated Workspace Name");
            expect(readWorkspace.description).toBe(
                "Updated description for the workspace.",
            );
        });
    });

    describe("DELETE", testSetup.DELETE, async () => {
        it("should delete a workspace", async () => {
            const response = await app.inject({
                method: "DELETE",
                url: `/api/v1/workspaces/${workspace.uuid}`,
            });

            expect(response.statusCode).toBe(204);

            // Verify if the workspace is deleted
            const checkResponse = await app.inject({
                method: "GET",
                url: `/api/v1/workspaces/profile/${workspace.uuid}`,
            });

            expect(checkResponse.statusCode).toBe(403); // Should return 403 Forbidden since the workspace is deleted
        });
    });
});
