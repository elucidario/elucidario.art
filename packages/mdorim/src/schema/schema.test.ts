import { describe, expect, it, test } from "vitest";

import { Schema } from "./schema";

describe("Schema", () => {
    it("should create a Schema instance", () => {
        const schema = new Schema();
        expect(schema).toBeDefined();
    });

    describe("getSchema", () => {
        it("should return /core/User", () => {
            const schemas = new Schema();

            const schema = schemas.getSchema("/core/User");
            expect(schema.$id).toBe("/core/User");
            expect(schema.properties?.uuid.$ref).toBe(
                "/core/definitions#/$defs/uuid",
            );
        });

        it("should return /core/definitions#/$defs/number", () => {
            const schemas = new Schema();

            const schema = schemas.getSchema("/core/definitions#/$defs/number");

            expect(schema.type).toBe("number");
        });

        it("should return /core/definitions#/$defs/created_at", () => {
            const schemas = new Schema();

            const schema = schemas.getSchema(
                "/core/definitions#/$defs/created_at",
            );
            expect(schema.type).toBe("string");
            expect(schema.format).toBe("date-time");
        });

        it("should return dereferenced schema", () => {
            const schemas = new Schema();

            const schema = schemas.getSchema("/core/User", {
                deref: true,
            });

            expect(schema.$id).toBe("/core/User");
            expect(schema.properties?.uuid.type).toBe("string");
            expect(schema.properties?.uuid.format).toBe("uuid");
            expect(schema.properties?.uuid.title).toBe("i18n:uuid");
        });

        it("should return translated schema", () => {
            const schemas = new Schema();

            const schema = schemas.getSchema("/core/User", {
                translate: true,
            });

            expect(schema.$id).toBe("/core/User");
            expect(schema.title).toBe("Usuário");
        });

        it("should return dereferenced and translated schema", () => {
            const schemas = new Schema();

            const schema = schemas.getSchema("/core/User", {
                deref: true,
                translate: true,
            });

            expect(schema.$id).toBe("/core/User");
            expect(schema.title).toBe("Usuário");
            expect(schema.properties?.uuid.type).toBe("string");
            expect(schema.properties?.uuid.format).toBe("uuid");
            expect(schema.properties?.uuid.title).toBe("UUID");
        });

        it("should remove required property", () => {
            const schemas = new Schema();

            const schema = schemas.getSchema("/core/User", {
                deref: true,
                translate: true,
                required: false,
            });

            expect(schema.$id).toBe("/core/User");
            expect(schema.title).toBe("Usuário");
            expect(schema.properties?.uuid.type).toBe("string");
            expect(schema.properties?.uuid.format).toBe("uuid");
            expect(schema.properties?.uuid.title).toBe("UUID");
            expect(schema.required).toBeUndefined();
        });
    });

    describe("should dereference", () => {
        test("anyOf schema", () => {
            const validator = new Schema();

            const deref = validator.dereference({
                $id: "/test/anyOf",
                type: "array",
                items: {
                    anyOf: [
                        {
                            $ref: "/core/definitions#/$defs/uuid",
                        },
                        {
                            $ref: "/core/definitions#/$defs/name",
                        },
                    ],
                },
            });

            expect(deref).toBeDefined();
            expect(deref.$id).toBe("/test/anyOf");
            expect(deref.items).toBeDefined();
            // @ts-ignore
            expect(deref.items.anyOf).toBeDefined();
            // @ts-ignore
            expect(deref.items.anyOf[0]).toBeDefined();
            // @ts-ignore
            expect(deref.items.anyOf[0].$ref).toBeUndefined();
            // @ts-ignore
            expect(deref.items.anyOf[0].title).toBe("i18n:uuid");
        });

        test("oneOf schema", () => {
            const validator = new Schema();

            const deref = validator.dereference({
                $id: "/test/anyOf",
                type: "array",
                items: {
                    oneOf: [
                        {
                            $ref: "/core/definitions#/$defs/uuid",
                        },
                        {
                            $ref: "/core/definitions#/$defs/name",
                        },
                    ],
                },
            });

            expect(deref).toBeDefined();
            expect(deref.$id).toBe("/test/anyOf");
            expect(deref.items).toBeDefined();
            // @ts-ignore
            expect(deref.items.oneOf).toBeDefined();
            // @ts-ignore
            expect(deref.items.oneOf[0]).toBeDefined();
            // @ts-ignore
            expect(deref.items.oneOf[0].$ref).toBeUndefined();
            // @ts-ignore
            expect(deref.items.oneOf[0].title).toBe("i18n:uuid");
        });
    });
});
