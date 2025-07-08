import { beforeAll, describe, expect, it } from "vitest";
import { MdorimBase } from "@elucidario/mdorim";

import { AQuery } from "@/application/queries/AQuery";
import { Cypher } from "@/application/Cypher";

class Query extends AQuery<MdorimBase> {
    constraints = [];
    constructor(cypher: Cypher) {
        super(cypher);
    }
}

describe("AQuery", () => {
    let query: Query;

    beforeAll(() => {
        query = new Query(new Cypher());
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
});
