import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DefaultLocale, I18n, Mdorim, User } from "@elucidario/mdorim";

import Core from "@/Core";
import { testSetup } from "@/tests/setup";
import { ConfigService } from "@/application/services";
import { Validator } from "@/application/Validator";
import { ConfigQuery } from "@/application/queries/core";

describe("ConfigService", async () => {
    let lcdr: Core;
    let service: ConfigService;

    const adminUser: User = {
        type: "User",
        email: "admin@example.com",
        username: "username123",
    };

    beforeAll(async () => {
        lcdr = new Core();
        service = new ConfigService(
            new Validator(new Mdorim(new I18n(DefaultLocale))),
            new ConfigQuery(lcdr.cypher),
            lcdr.authorization,
            lcdr.graph,
            lcdr.hooks,
        );
        await lcdr.setup();
        await lcdr.graph.writeTransaction(async (tx) => {
            await tx.run(
                "OPTIONAL MATCH (u:User {email: $email}) DETACH DELETE u",
                {
                    email: adminUser.email,
                },
            );
            await tx.run("OPTIONAL MATCH (m:MainConfig) DETACH DELETE m");
        });
    });

    afterAll(async () => {
        if (!testSetup.DELETE.skip) {
            await lcdr.graph.writeTransaction(async (tx) => {
                await tx.run(
                    "OPTIONAL MATCH (u:User {email: $email}) DETACH DELETE u",
                    {
                        email: adminUser.email,
                    },
                );
                await tx.run("OPTIONAL MATCH (m:MainConfig) DETACH DELETE m");
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

    describe("CREATE", testSetup.CREATE, async () => {
        it("should setMainConfig", async () => {
            const config = await service.setMainConfig({
                type: "MainConfig",
                sysadmins: [adminUser],
            });

            expect(config).toHaveProperty("type", "MainConfig");
            expect(config).toHaveProperty("sysadmins");
            expect(config.sysadmins).toBeInstanceOf(Array);
            expect(config.sysadmins[0]).toHaveProperty(
                "email",
                adminUser.email,
            );
            expect(config.sysadmins[0]).toHaveProperty(
                "username",
                adminUser.username,
            );
        });
    });

    describe("READ", testSetup.READ, async () => {
        it("should getMainConfig", async () => {
            const config = await service.getMainConfig();
            expect(config).toHaveProperty("type", "MainConfig");
            expect(config).toHaveProperty("sysadmins");
            expect(config.sysadmins).toBeInstanceOf(Array);
            expect(config.sysadmins[0]).toHaveProperty(
                "email",
                adminUser.email,
            );
            expect(config.sysadmins[0]).toHaveProperty(
                "username",
                adminUser.username,
            );
        });
    });
});
