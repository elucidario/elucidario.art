import { describe, expect, it } from "vitest";
import { MongoAbility, RawRuleOf } from "@casl/ability";

import { Authorization } from "@/application/Authorization";
import { Actions, Filters } from "@/domain/hooks";

describe("Authorization", { skip: false }, () => {
    const hooks = {
        actions: new Actions(),
        filters: new Filters(),
    };

    it("should create an instance", () => {
        const auth = new Authorization(hooks);
        expect(auth).toBeInstanceOf(Authorization);
    });

    it("should add rules", () => {
        const auth = new Authorization(hooks);

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
});
