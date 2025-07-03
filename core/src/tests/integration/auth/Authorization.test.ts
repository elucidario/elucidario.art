import { describe, expect, it } from "vitest";

import { Authorization } from "@/app";
import { Actions, Filters } from "@/hooks";
import { MongoAbility, RawRuleOf } from "@casl/ability";

describe("Authorization", { only: true }, () => {
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
        hooks.filters.add<RawRuleOf<MongoAbility>[]>(
            "authorization.rules",
            (rules) => [...rules, { action: "read", subject: "User" }],
        );

        const ability = auth.permissions();
        expect(ability.can("read", "User")).toBe(true);
    });
});
