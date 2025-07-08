import { describe, expect, it } from "vitest";

import { Cypher } from "@/application/Cypher";

describe("Cypher", { skip: false }, () => {
    const cypher = new Cypher();

    it("should cypherBuilder", () => {
        const query = cypher
            .builder((Cypher) => {
                const node = new Cypher.Node();
                const pattern = new Cypher.Pattern(node, {
                    labels: ["TestNode"],
                });
                const match = new Cypher.Match(pattern);
                match.return(node);

                return match;
            })
            .build();

        expect(query.cypher).toBeDefined();
        expect(query.params).toBeDefined();
        expect(query.cypher.toString()).toBe(
            `MATCH (this0:TestNode)
RETURN this0`,
        );
    });
});
