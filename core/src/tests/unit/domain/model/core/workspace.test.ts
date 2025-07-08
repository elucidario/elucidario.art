import { describe, expect, it } from "vitest";
import { Workspace as WorkspaceType } from "@elucidario/mdorim";
import { Workspace } from "@/domain/models/core";

describe("Workspace Model", { skip: false }, () => {
    it("should create a Workspace instance with default values", () => {
        const user = new Workspace();
        expect(user).toBeInstanceOf(Workspace);
        expect(user.schema).toBe("/core/Workspace");
    });

    it("should create a Workspace instance with provided data", () => {
        const workspace: WorkspaceType = {
            type: "Workspace",
            _label: "Test Workspace",
            name: "Workspace Name",
            description: "This is a test workspace",
        };
        const user = new Workspace(workspace);
        expect(user).toBeInstanceOf(Workspace);
        expect(user.schema).toBe("/core/Workspace");
    });
});
