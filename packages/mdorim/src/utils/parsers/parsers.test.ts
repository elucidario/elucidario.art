import { describe, expect, it } from "vitest";

import { mapFileId, parseRef, parseSchema } from "./";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";

describe("mapFileId", () => {
    it("should map file path to ID if starts with #", () => {
        const id = mapFileId("#test", "Test");
        expect(id).toBe("/Test#test");
    })

    it("should map file .json path to ID", () => {
        const id = mapFileId("core.json#/$defs/ContextStringOrArray", "Test/Test");
        expect(id).toBe("/Test/Core#/$defs/ContextStringOrArray");
    })

    it("should ignore already mapped ID", () => {
        const id = mapFileId("/Test/Core#/$defs/ContextStringOrArray");
        expect(id).toBe("/Test/Core#/$defs/ContextStringOrArray");
    })
})


describe("parseRef", () => {
    it("should parse $ref and map file ID", () => {
        const schema = {
            $id: "Test/Test",
            $schema: "https://json-schema.org/draft/2020-12/schema",
            $ref: "#/definitions/Test",
            definitions: {
                Test: {
                    type: "string",
                },
            },
        };
        const parsed = parseRef(schema as JSONSchema, "Test");
        expect(parsed.$ref).toBe("/Test#/definitions/Test");
    })

    it("should filter out required properties", () => {
        const schema = {
            $id: "Test/Test",
            $schema: "https://json-schema.org/draft/2020-12/schema",
            type: "object",
            properties: {
                name: { type: "string" },
                age: { type: "number" },
            },
            required: ["name", "age"],
        };
        const filterRequired = (required: string[]) => required.filter((r) => r !== "age");
        const parsed = parseRef(schema as JSONSchema, "Test", filterRequired);
        expect(parsed.required).toEqual(["name"]);
    })

    it("should ignore filter if no callback", () => {
        const schema = {
            $id: "Test/Test",
            $schema: "https://json-schema.org/draft/2020-12/schema",
            type: "object",
            properties: {
                name: { type: "string" },
                age: { type: "number" },
            },
            required: ["name", "age"],
        };
        const parsed = parseRef(schema as JSONSchema, "Test");
        expect(parsed.required).toEqual(["name", "age"]);
    })
})

describe("parseSchema", () => {
    it("should parse schema with $ref and map file ID", () => {
        const schema = {
            $id: "Banana/Test",
            $schema: "https://json-schema.org/draft/2020-12/schema",
            $ref: "#/definitions/Test",
            definitions: {
                Test: {
                    type: "string",
                },
            },
        };
        const parsed = parseSchema(schema as JSONSchema, "Test");
        expect(parsed.$ref).toBe("/Test#/definitions/Test");
        // id must be overridden by parseSchema second argument
        expect(parsed.$id).toBe("Test");
        expect(parsed.$schema).toBeUndefined();
    })
})
