import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
    DefaultLocale,
    I18n,
    Mdorim,
    User as UserType,
    Workspace as WorkspaceType,
} from "@elucidario/mdorim";

import { testSetup } from "@/tests/setup";
import Core from "@/Core";
import {
    ConfigService,
    UserService,
    WorkspaceService,
} from "@/application/services";
import { Validator } from "@/application/Validator";
import {
    ConfigQuery,
    UserQuery,
    WorkspaceQuery,
} from "@/application/queries/core";

describe("WorkspaceService", { skip: false }, async () => {
    let lcdr: Core;
    let service: WorkspaceService;
    let user: UserType | null | undefined;

    let workspace: WorkspaceType | null | undefined;

    const adminUser = {
        type: "User" as const,
        email: "admin@example.com",
        username: "username_admin",
    };

    beforeAll(async () => {
        lcdr = new Core();
        service = new WorkspaceService(
            new Validator(new Mdorim(new I18n(DefaultLocale))),
            new WorkspaceQuery(lcdr.cypher),
            lcdr.auth,
            lcdr.graph,
            lcdr.hooks,
        );

        await lcdr.setup();
        await lcdr.graph.writeTransaction(async (tx) => {
            await tx.run("MATCH (u:User {email: $email}) DETACH DELETE u", {
                email: adminUser.email,
            });

            await tx.run("MATCH (m:MainConfig) DETACH DELETE m");

            await tx.run("MATCH (w:Workspace) DETACH DELETE w");
        });

        const config = new ConfigService(
            new Validator(new Mdorim(new I18n(DefaultLocale))),
            new ConfigQuery(lcdr.cypher),
            lcdr.auth,
            lcdr.graph,
            lcdr.hooks,
        );
        await config.setMainConfig({
            type: "MainConfig",
            sysadmins: [adminUser],
        });

        const userService = new UserService(
            new Validator(new Mdorim(new I18n(DefaultLocale))),
            new UserQuery(lcdr.cypher),
            lcdr.auth,
            lcdr.graph,
            lcdr.hooks,
        );
        userService.setContext({
            user: adminUser,
            role: "admin",
        });
        user = await userService.read({ email: adminUser.email });
    });

    afterAll(async () => {
        if (!testSetup.DELETE.skip) {
            await lcdr.graph.writeTransaction(async (tx) => {
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

        await lcdr.close();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("CREATE", testSetup.CREATE, async () => {
        it("should create a workspace", async () => {
            service.setContext({
                user: user!,
                role: "admin",
            });
            workspace = await service.create({
                name: "Test Workspace from WorkspaceModel.test",
            });

            expect(workspace).toBeDefined();
            expect(workspace.name).toBe(
                "Test Workspace from WorkspaceModel.test",
            );
            expect(workspace.uuid).toBeDefined();
        });
    });

    describe("READ", testSetup.READ, async () => {
        it("should read a workspace by UUID", async () => {
            const readWorkspace = await service.read({ uuid: workspace!.uuid });
            expect(readWorkspace).toBeDefined();
            expect(readWorkspace.name).toBe(
                "Test Workspace from WorkspaceModel.test",
            );
        });

        it("should list all workspaces", async () => {
            const workspaces = await service.list();
            expect(workspaces).toBeDefined();
            expect(workspaces.length).toBeGreaterThan(0);
        });
    });

    describe("UPDATE", testSetup.UPDATE, async () => {
        it("should update a workspace", async () => {
            const updatedWorkspace = await service.update(workspace!.uuid!, {
                name: "Updated Workspace Name",
                description: "Updated description for the workspace.",
            });

            expect(updatedWorkspace).toBeDefined();
            expect(updatedWorkspace.name).toBe("Updated Workspace Name");
            expect(updatedWorkspace.description).toBe(
                "Updated description for the workspace.",
            );
        });
    });

    describe("DELETE", testSetup.DELETE, async () => {
        it("should delete a workspace", async () => {
            const deleted = await service.delete(workspace!.uuid!);
            expect(deleted).toBe(true);
        });
    });
});
