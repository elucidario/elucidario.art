import { beforeAll, describe, expect, it } from "vitest";

import { AbstractQuery } from "@/queries/AbstractQuery";
import { Cypher } from "@/db";
import { Hooks } from "@/types";
import { Actions, Filters } from "@/hooks";
import { MdorimBase } from "@elucidario/mdorim";

class Query extends AbstractQuery<MdorimBase> {
    constraints = [];
    constructor(cypher: Cypher, hooks: Hooks) {
        super(cypher, hooks);
    }
}

describe("AbstractQuery", () => {
    let query: Query;

    beforeAll(() => {
        query = new Query(new Cypher(), {
            actions: new Actions(),
            filters: new Filters(),
        });
    });

    it("should be defined", () => {
        expect(query).toBeDefined();
    });

    it("should be an abstract class", () => {
        expect(query).toBeInstanceOf(Query);
    });

    it("should have a cypher property", () => {
        expect(query.cypher).toBeDefined();
    });

    it("should have a hooks property", () => {
        // @ts-expect-error protected property
        expect(query.hooks).toBeDefined();
    });
});
