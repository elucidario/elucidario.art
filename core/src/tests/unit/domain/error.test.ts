import { describe, expect, it } from "vitest";

import {
    GraphError,
    ServiceError,
    ModelError,
    QueryError,
    isGraphError,
    isServiceError,
    isModelError,
    isQueryError,
    isNeo4jError,
} from "@/domain/errors";

describe("Errors", { skip: false }, () => {
    it("should identify GraphError", () => {
        const error = new GraphError("Test Graph Error");
        expect(isGraphError(error)).toBe(true);
        expect(isServiceError(error)).toBe(false);
        expect(isModelError(error)).toBe(false);
        expect(isQueryError(error)).toBe(false);
        expect(isNeo4jError(error)).toBe(false);
    });

    it("should identify ServiceError", () => {
        const error = new ServiceError("Test Service Error");
        expect(isServiceError(error)).toBe(true);
        expect(isGraphError(error)).toBe(false);
        expect(isModelError(error)).toBe(false);
        expect(isQueryError(error)).toBe(false);
        expect(isNeo4jError(error)).toBe(false);
    });

    it("should identify ModelError", () => {
        const error = new ModelError("Test Service Error");
        expect(isServiceError(error)).toBe(false);
        expect(isGraphError(error)).toBe(false);
        expect(isModelError(error)).toBe(true);
        expect(isQueryError(error)).toBe(false);
        expect(isNeo4jError(error)).toBe(false);
    });

    it("should identify QueryError", () => {
        const error = new QueryError("Test Query Error");
        expect(isQueryError(error)).toBe(true);
        expect(isGraphError(error)).toBe(false);
        expect(isServiceError(error)).toBe(false);
        expect(isModelError(error)).toBe(false);
        expect(isNeo4jError(error)).toBe(false);
    });

    it("should identify Neo4jError", () => {
        const error = new Error("Test Neo4j Error");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).name = "Neo4jError"; // Simulating a Neo4j error
        expect(isNeo4jError(error)).toBe(true);
        expect(isGraphError(error)).toBe(false);
        expect(isServiceError(error)).toBe(false);
        expect(isModelError(error)).toBe(false);
        expect(isQueryError(error)).toBe(false);
    });

    it("should not identify non-error objects", () => {
        const notAnError = { message: "Not an error" };
        expect(isGraphError(notAnError)).toBe(false);
        expect(isServiceError(notAnError)).toBe(false);
        expect(isNeo4jError(notAnError)).toBe(false);
        expect(isModelError(notAnError)).toBe(false);
        expect(isQueryError(notAnError)).toBe(false);
    });
});
