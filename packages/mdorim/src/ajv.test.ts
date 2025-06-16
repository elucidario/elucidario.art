import { describe, expect, it } from "vitest";

import Ajv from "ajv";
import addFormats from "ajv-formats";

import * as schemas from "@/schemas/core";
import * as linkedArtSchemas from "@/schemas/linked-art";

describe("ajv", () => {
    it("should validate simple schema", () => {
        const ajv = new Ajv();
        const schema = {
            $id: "http://example.com/schema.json",
            type: "object",
            properties: {
                name: { type: "string" },
                age: { type: "number" },
            },
            required: ["name", "age"],
        };

        const validate = ajv.compile(schema);
        const valid = validate({ name: "John", age: 30 });

        expect(valid).toBe(true);

        const another = ajv.getSchema("http://example.com/schema.json");
        expect(another).toBeDefined();
        expect(another?.({ name: "Jane", age: 25 })).toBe(true);
        expect(another?.schema).toEqual(schema);
    });

    it("should add schemas", () => {
        const ajv = new Ajv();
        addFormats(ajv);

        for (const [key, value] of Object.entries(schemas)) {
            if (typeof value === "object" && value !== null) {
                const id = `/core/${key}`;
                // @ts-expect-error $schema is undefined
                const { $schema, ...schema } = value;
                ajv.addSchema(schema, id);
            }
        }

        for (const [key, value] of Object.entries(linkedArtSchemas)) {
            if (typeof value === "object" && value !== null) {
                const id = `/linked-art/${key}`;
                const { $schema, ...schema } = value;
                ajv.addSchema(schema, id);
            }
        }
        const userSchema = ajv.getSchema("/core/User");
        expect(userSchema).toBeDefined();
        expect(userSchema?.schema).toEqual(schemas.User);
    });
});
