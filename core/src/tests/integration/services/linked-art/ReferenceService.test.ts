import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
    DefaultLocale,
    GenericType,
    I18n,
    Mdorim,
    NoUUID,
    Reference,
    Workspace,
} from "@elucidario/mdorim";

import { testSetup } from "@/tests/setup";
import {
    ConfigService,
    ReferenceService,
    WorkspaceService,
} from "@/application/services";
import Core from "@/Core";
import { Validator } from "@/application/Validator";
import { ReferenceQuery } from "@/application/queries/linked-art";
import { ConfigQuery } from "@/application/queries/core/ConfigQuery";
import { WorkspaceQuery } from "@/application/queries/core/WorkspaceQuery";

describe("ReferenceService", { skip: false }, async () => {
    let lcdr: Core;
    let service: ReferenceService;

    const testUser = {
        email: "testador@example.com.br",
        username: "username_testador",
    };

    const adminUser = {
        type: "User" as const,
        email: "admin@example.com",
        username: "username_admin",
    };

    let workspace: Workspace;
    let basicRef: Reference<GenericType>;
    let completeRef: Reference<GenericType>;

    beforeAll(async () => {
        lcdr = new Core();

        service = new ReferenceService(
            new Validator(new Mdorim(new I18n(DefaultLocale))),
            new ReferenceQuery(lcdr.cypher),
            lcdr.authorization,
            lcdr.graph,
            lcdr.hooks,
        );

        await lcdr.graph.writeTransaction(async (tx) => {
            await tx.run("MATCH (u:User {email: $email}) DETACH DELETE u", {
                email: adminUser.email,
            });
            await tx.run("MATCH (u:User {email: $email}) DETACH DELETE u", {
                email: testUser.email,
            });
            await tx.run("MATCH (m:MainConfig) DETACH DELETE m");
            await tx.run("MATCH (w:Workspace) DETACH DELETE w");
            await tx.run("MATCH (r:Reference) DETACH DELETE r");
            await tx.run("MATCH (m:Member) DETACH DELETE m");
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

        const workspaceService = new WorkspaceService(
            new Validator(new Mdorim(new I18n(DefaultLocale))),
            new WorkspaceQuery(lcdr.cypher),
            lcdr.authorization,
            lcdr.graph,
            lcdr.hooks,
        );
        workspaceService.setContext({
            user: adminUser,
            role: "admin",
        });
        workspace = await workspaceService.create({
            name: "Test Workspace from ReferenceService",
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
                await tx.run("MATCH (w:Workspace) DETACH DELETE w");
                await tx.run("MATCH (r:Reference) DETACH DELETE r");
                await tx.run("MATCH (m:Member) DETACH DELETE m");
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

    describe("CREATE", testSetup.CREATE, () => {
        it("should create a basic Reference", { skip: false }, async () => {
            const payload: NoUUID<Reference<"Type">> = {
                type: "Type",
                id: "https://uma-url.com",
                _label: "Test Reference",
            };

            service.setContext({
                user: adminUser,
                role: "admin",
                workspace,
            });
            const created = await service.create<"Type">(payload);
            expect(created).toBeDefined();
            expect(created.uuid).toBeDefined();

            basicRef = created;
        });

        it("should create a Reference with additional properties", async () => {
            service.setContext({
                user: adminUser,
                role: "admin",
                workspace,
            });

            const languageRef = await service.create<"Language">({
                type: "Language",
                id: "https://uma-url.com/language",
                _label: "Language Reference",
            });

            const params: NoUUID<Reference<"Type">> = {
                type: "Type",
                id: "https://uma-url.com/extra",
                _label: "Test Reference Extra",
                equivalent: [
                    {
                        type: "Language",
                        _label: "Language Equivalent",
                        id: "https://uma-url.com/language-equivalent",
                        uuid: languageRef.uuid, // reference to the previously created concept
                    },
                    {
                        type: "Type",
                        _label: "Basic Reference Equivalent",
                        id: "https://uma-url.com/basic-equivalent",
                        uuid: basicRef.uuid, // reference to the previously created basicRef
                    },
                ],
            };

            const created = await service.create<"Type">(params);

            expect(created).toBeDefined();
            expect(created.uuid).toBeDefined();

            completeRef = created;
        });
    });

    describe("READ", testSetup.READ, () => {
        it("should read a Reference with no equivalents by UUID", async () => {
            const result = await service.read({
                type: "Type",
                uuid: basicRef.uuid,
            });
            expect(result).toBeDefined();
            expect(result.uuid).toBeDefined();
        });

        it("should read a Reference with equivalents by UUID", async () => {
            const result = await service.read({
                type: "Type",
                uuid: completeRef.uuid,
            });
            expect(result).toBeDefined();
            expect(result.uuid).toBeDefined();
            expect(result.equivalent).toBeDefined();
            expect(result.equivalent?.length).toBe(2);
        });

        it("should list references", async () => {
            const result = await service.list();

            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
        });

        it("should list references of specific type", async () => {
            const result = await service.list({
                type: "Type",
            });
            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].type).toBe("Type");
        });
    });

    describe("UPDATE", testSetup.UPDATE, () => {
        it("should update a Reference", async () => {
            const params: NoUUID<Reference<"Type">> = {
                type: "Type",
                id: "https://uma-url.com/update",
                _label: "Test Reference Update",
            };

            const result = await service.update(basicRef.uuid!, params);

            expect(result).toBeDefined();
            expect(result.uuid).toBeDefined();
            expect(result._label).toBe("Test Reference Update");
        });
    });

    describe("DELETE", testSetup.DELETE, () => {
        it("should delete a Reference", async () => {
            expect(await service.delete(basicRef.uuid!)).toBeTruthy();
            expect(await service.delete(completeRef.uuid!)).toBeTruthy();
        });
    });
});
