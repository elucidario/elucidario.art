import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { lcdr } from "@/app";
import { testSetup } from "@/tests/setup";

describe("ConfigService", { skip: false }, async () => {
    const adminUser = {
        email: "admin@example.com",
        username: "username123",
    };

    beforeAll(async () => {
        const app = await lcdr(false);
        const graph = app.lcdr.graph;

        // erase everything before the test
        await graph.writeTransaction(async (tx) => {
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
        const app = await lcdr(false);
        const graph = app.lcdr.graph;

        if (!testSetup.DELETE.skip) {
            await graph.writeTransaction(async (tx) => {
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

        app.close();
    });

    it("should be defined", async () => {
        const app = await lcdr(false);
        expect(app).toBeDefined();
        expect(app.services.config).toBeDefined();
    });

    describe("CREATE", testSetup.CREATE, async () => {
        it("should create main config", async () => {
            const app = await lcdr(false);

            const response = await app.inject({
                method: "POST",
                url: "/api/v1/config",
                payload: {
                    type: "MainConfig",
                    sysadmins: [adminUser],
                },
            });

            expect(response.statusCode).toBe(201);
            expect(response.json()).toHaveProperty("type", "MainConfig");
            expect(response.json()).toHaveProperty("sysadmins");
            expect(response.json().sysadmins).toBeInstanceOf(Array);
            expect(response.json().sysadmins[0]).toHaveProperty(
                "email",
                adminUser.email,
            );
            expect(response.json().sysadmins[0]).toHaveProperty(
                "username",
                adminUser.username,
            );
        });
    });

    describe("READ", testSetup.READ, async () => {
        it("should read MainConfig", async () => {
            const app = await lcdr(false);

            const response = await app.inject({
                method: "GET",
                url: "/api/v1/config",
            });

            expect(response.statusCode).toBe(200);
            expect(response.json()).toHaveProperty("type", "MainConfig");
            expect(response.json()).toHaveProperty("sysadmins");
            expect(response.json().sysadmins).toBeInstanceOf(Array);
            expect(response.json().sysadmins[0]).toHaveProperty(
                "email",
                adminUser.email,
            );
            expect(response.json().sysadmins[0]).toHaveProperty(
                "username",
                adminUser.username,
            );
        });
    });
});
