import { describe, expect, it } from "vitest";
import { MongoAbility, RawRuleOf } from "@casl/ability";

import { Auth } from "@/application/auth/Auth";
import { Actions, Filters } from "@/domain/hooks";
import { Cypher } from "@/application/Cypher";
import { Graph } from "@/application/Graph";
import { getDriver } from "@/infrastructure/db/driver";

describe("Auth", { skip: false }, () => {
    const hooks = {
        actions: new Actions(),
        filters: new Filters(),
    };

    it("should create an instance", () => {
        const cypher = new Cypher();
        const auth = new Auth(
            cypher,
            new Graph(getDriver(), cypher, hooks),
            hooks,
        );
        expect(auth).toBeInstanceOf(Auth);
    });

    it("should add rules", () => {
        const cypher = new Cypher();
        const auth = new Auth(
            cypher,
            new Graph(getDriver(), cypher, hooks),
            hooks,
        );

        hooks.filters.add<RawRuleOf<MongoAbility>[], unknown[]>(
            "authorization.rules",
            (rules) => [...rules, { action: "read", subject: "User" }],
        );

        const ability = auth.permissions({
            user: { uuid: "123", type: "User" },
            role: "admin",
        });
        expect(ability.can("read", "User")).toBe(true);
    });

    it("should get roles", () => {
        const cypher = new Cypher();
        const auth = new Auth(
            cypher,
            new Graph(getDriver(), cypher, hooks),
            hooks,
        );

        const roles = auth.getRoles();
        expect(roles).toEqual(["admin", "editor", "assistant", "researcher"]);
    });
});
