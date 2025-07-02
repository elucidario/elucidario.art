import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { lcdr } from "@/app";

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
            return await tx.run("MATCH (n) DETACH DELETE n");
        });
    });

    afterAll(async () => {
        const app = await lcdr(false);
        const graph = app.lcdr.graph;

        await graph.writeTransaction(async (tx) => {
            return await tx.run("MATCH (n) DETACH DELETE n");
        });

        app.close();
    });

    it("should be defined", async () => {
        const app = await lcdr(false);
        expect(app).toBeDefined();
        expect(app.services.config).toBeDefined();
    });

    describe("CREATE", async () => {
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

    describe("READ", async () => {
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
