import { afterAll, beforeAll, describe, expect, it, test } from "vitest";

import { WorkspaceModel } from "./WorkspaceModel";
import { Workspace } from "@elucidario/mdorim";
import Core from "@/Core";

describe("WorkspaceModel", () => {
    let model: WorkspaceModel | undefined;
    let workspace: Workspace;

    beforeAll(async () => {
        WorkspaceModel.register();
        model = new WorkspaceModel(Core.getInstance());
        WorkspaceModel.register();
    });

    afterAll(async () => {
        model = undefined;
    });

    it("should be defined", () => {
        expect(model).toBeDefined();
    });

    test("should have a create method", () => {
        expect(model!.create).toBeDefined();
        expect(typeof model!.create).toBe("function");
    });

    test("should have a read method", () => {
        expect(model!.read).toBeDefined();
        expect(typeof model!.read).toBe("function");
    });

    test("should have an update method", () => {
        expect(model!.update).toBeDefined();
        expect(typeof model!.update).toBe("function");
    });

    test("should have a delete method", () => {
        expect(model!.delete).toBeDefined();
        expect(typeof model!.delete).toBe("function");
    });

    describe("CREATE", async () => {
        it("should create a workspace", async () => {
            workspace = await model!.create({
                name: "Test Workspace from WorkspaceModel.test",
            });
            expect(workspace).toBeDefined();
            expect(workspace.name).toBe(
                "Test Workspace from WorkspaceModel.test",
            );
        });
    });

    describe("READ", async () => {
        it("should read a workspace by ID", async () => {
            const readWorkspace = await model!.read(workspace.uuid);
            expect(readWorkspace).toBeDefined();
            expect(readWorkspace?.name).toBe(
                "Test Workspace from WorkspaceModel.test",
            );
        });

        it("should list all workspaces", async () => {
            const workspaces = await model!.list();
            expect(workspaces).toBeDefined();
            expect(workspaces.length).toBeGreaterThan(0);
        });
    });

    describe("UPDATE", async () => {
        it("should update a workspace", async () => {
            const updatedWorkspace = await model!.update(workspace.uuid, {
                name: "Updated Workspace",
            });
            expect(updatedWorkspace).toBeDefined();
            expect(updatedWorkspace.name).toBe("Updated Workspace");
        });
    });

    describe("DELETE", async () => {
        it("should delete a workspace", async () => {
            const deleted = await model!.delete(workspace.uuid);
            expect(deleted).toBe(true);
            const readWorkspace = await model!.read(workspace.uuid);
            expect(readWorkspace).toBeNull();
        });
    });
});
