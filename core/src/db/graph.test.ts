import { beforeAll, afterAll, describe, expect, it } from "vitest";

import { Graph } from "./Graph";

describe("Graph db", () => {
    let graph: Graph | undefined;

    beforeAll(() => {
        graph = Graph.getInstance();
    });

    afterAll(() => {
        graph = undefined;
    });

    it("should create a new node", async () => {
        const result = await graph?.executeQuery(
            (response) => response,
            "CREATE (n:TestNode {name: 'Test'}) RETURN n",
        );

        expect(result).toBeDefined();
        expect(result?.records.length).toBe(1);
        expect(result?.records[0].get("n").properties.name).toBe("Test");
    });

    it("should list all constraints", async () => {
        const constraints = await graph?.getConstraints();
        expect(constraints).toBeDefined();
    });

    it("should delete a node", async () => {
        const result = await graph?.executeQuery(
            (response) => response,
            "MATCH (n:TestNode {name: 'Test'}) DELETE n",
        );

        expect(result).toBeDefined();
        expect(result?.summary.counters.updates().nodesDeleted).toBe(1);
    });
});
