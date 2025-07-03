import { describe, expect, it, test } from "vitest";

import { Mdorim } from "./mdorim";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { I18n } from "@/translations";
import { DefaultLocale } from "@/types";

describe("Mdorim", () => {
    const i18n = new I18n(DefaultLocale);

    it("should create a Mdorim instance", () => {
        const schema = new Mdorim(i18n);
        expect(schema).toBeDefined();
    });

    describe("getSchema", () => {
        it("should return /core/User", () => {
            const schemas = new Mdorim(i18n);

            const schema = schemas.getSchema("/core/User");
            expect(schema.$id).toBe("/core/User");
            expect((schema.properties?.uuid as JSONSchema).$ref).toBe(
                "/core/Definitions#/$defs/uuid",
            );
        });

        it("should return /linked-art/Provenance", () => {
            const schemas = new Mdorim(i18n);

            const schema = schemas.getSchema("/linked-art/Provenance");
            expect(schema.$id).toBe("/linked-art/Provenance");
            expect((schema.properties?.uuid as JSONSchema).$ref).toBe(
                "/core/Definitions#/$defs/uuid",
            );
        });

        it("should return /core/Definitions#/$defs/number", () => {
            const schemas = new Mdorim(i18n);

            const schema = schemas.getSchema("/core/Definitions#/$defs/number");

            expect(schema.type).toBe("number");
        });

        it("should return /core/Definitions#/$defs/created_at", () => {
            const schemas = new Mdorim(i18n);

            const schema = schemas.getSchema(
                "/core/Definitions#/$defs/created_at",
            );
            expect(schema.type).toBe("string");
            expect(schema.format).toBe("date-time");
        });

        it("should remove required property", () => {
            const schemas = new Mdorim(i18n);

            const schema = schemas.getSchema("/core/User", false);

            expect(schema.$id).toBe("/core/User");
            expect(schema.title).toBe("i18n:user");
            expect((schema.properties?.uuid as JSONSchema).$ref).toBe(
                "/core/Definitions#/$defs/uuid",
            );
            expect(schema.required).toBeUndefined();
        });

        describe("errors", () => {
            it("should throw error if schema not found", () => {
                const schemas = new Mdorim(i18n);

                expect(() =>
                    schemas.getSchema("/core/NonExistent"),
                ).toThrowError(
                    "MdorimError: Schema /core/NonExistent not found",
                );
            });

            it("should throw error if nested schema is not found", () => {
                const schemas = new Mdorim(i18n);

                expect(() =>
                    schemas.getSchema("/core/Workspace#/$defs/notFound"),
                ).toThrow(
                    "MdorimError: Schema /core/Workspace#/$defs/notFound not found",
                );
            });
        });
    });

    describe("should dereference", () => {
        it("should have a property from linked-art in mdorim", async () => {
            const schemas = new Mdorim(i18n);

            const schema = schemas.getSchema("/core/Workspace");

            expect(schema.$id).toBe("/core/Workspace");
            expect(schema.properties?.organizations).toBeDefined();
            expect((schema.properties?.organizations as JSONSchema).type).toBe(
                "array",
            );
        });

        it("should return dereferenced schema", async () => {
            const schemas = new Mdorim(i18n);

            const schema = schemas.getSchema("/core/User");
            const deref = await schemas.dereference(schema);
            expect(deref.$id).toBe("/core/User");
            expect((deref.properties?.uuid as JSONSchema).type).toBe("string");
            expect((deref.properties?.uuid as JSONSchema).format).toBe("uuid");
            expect((deref.properties?.uuid as JSONSchema).title).toBe(
                "i18n:uuid",
            );
        });

        test("anyOf schema", async () => {
            const validator = new Mdorim(i18n);

            const deref = await validator.dereference({
                $id: "/test/anyOf",
                type: "array",
                items: {
                    anyOf: [
                        {
                            $ref: "./core/definitions.json#/$defs/uuid",
                        },
                        {
                            $ref: "./core/definitions.json#/$defs/name",
                        },
                    ],
                },
            });

            expect(deref).toBeDefined();
            expect(deref.$id).toBe("/test/anyOf");
            expect(deref.items).toBeDefined();
            // @ts-expect-error items is JSONSchema
            expect(deref.items.anyOf).toBeDefined();
            // @ts-expect-error items is JSONSchema
            expect(deref.items.anyOf[0]).toBeDefined();
            // @ts-expect-error items is JSONSchema
            expect(deref.items.anyOf[0].$ref).toBeUndefined();
            // @ts-expect-error items is JSONSchema
            expect(deref.items.anyOf[0].title).toBe("i18n:uuid");
        });

        test("oneOf schema", async () => {
            const validator = new Mdorim(i18n);

            const deref = await validator.dereference({
                $id: "/test/anyOf",
                type: "array",
                items: {
                    oneOf: [
                        {
                            $ref: "./core/definitions.json#/$defs/uuid",
                        },
                        {
                            $ref: "./core/definitions.json#/$defs/name",
                        },
                    ],
                },
            });

            expect(deref).toBeDefined();
            expect(deref.$id).toBe("/test/anyOf");
            expect(deref.items).toBeDefined();
            // @ts-expect-error items is JSONSchema
            expect(deref.items.oneOf).toBeDefined();
            // @ts-expect-error items is JSONSchema
            expect(deref.items.oneOf[0]).toBeDefined();
            // @ts-expect-error items is JSONSchema
            expect(deref.items.oneOf[0].$ref).toBeUndefined();
            // @ts-expect-error items is JSONSchema
            expect(deref.items.oneOf[0].title).toBe("i18n:uuid");
        });
    });

    describe("should translate schema", () => {
        it("should return translated schema", async () => {
            const schemas = new Mdorim(i18n);

            const schema = schemas.getSchema("/core/User");
            const translatedSchema = schemas.translateSchema(schema);

            expect(translatedSchema.$id).toBe("/core/User");
            expect(translatedSchema.title).toBe("Usuário");
        });

        it("should return dereferenced and translated schema", async () => {
            const schemas = new Mdorim(i18n);

            const schema = schemas.getSchema("/core/User");
            const deref = await schemas.dereference(schema);
            const translatedSchema = schemas.translateSchema(deref);

            expect(translatedSchema.$id).toBe("/core/User");
            expect(translatedSchema.title).toBe("Usuário");
            expect((translatedSchema.properties?.uuid as JSONSchema).type).toBe(
                "string",
            );
            expect(
                (translatedSchema.properties?.uuid as JSONSchema).format,
            ).toBe("uuid");
            expect(
                (translatedSchema.properties?.uuid as JSONSchema).title,
            ).toBe("UUID");

            describe("error", () => {
                it("should throw error if schema is not found", async () => {
                    const schemas = new Mdorim(i18n);

                    const schema = {
                        // $id: "/core/NonExistent",
                        type: "object",
                        properties: {
                            nonexistent: {
                                $ref: "/core/NonExistent",
                            },
                        },
                    };

                    await expect(
                        await schemas.dereference(schema as JSONSchema),
                    ).rejects.toThrow(
                        "MdorimError: Mdorim /core/NonExistent not found",
                    );
                });
            });
        });
    });

    describe("should validate schema", () => {
        it("should validate /core/User", async () => {
            const validator = new Mdorim(i18n);
            const user = {
                username: "John-Doe",
                email: "john@example.com",
            };

            expect(await validator.validate("/core/User", user)).toBeTruthy();
        });

        it("should validate /core/Definitions#/$defs/uuid", async () => {
            const validator = new Mdorim(i18n);
            const uuid = "123e4567-e89b-12d3-a456-426614174000";

            expect(
                await validator.validate("/core/Definitions#/$defs/uuid", uuid),
            ).toBeTruthy();
        });
    });

    describe("private methods", () => {
        const mdorim = new Mdorim(i18n);

        describe("mapFileId", () => {
            it("should map file path to ID if starts with #", () => {
                // @ts-expect-error private method
                const id = mdorim.mapFileId("#test", "Test");
                expect(id).toBe("/Test#test");
            });

            it("should map file .json path to ID", () => {
                // @ts-expect-error private method
                const id = mdorim.mapFileId(
                    "core.json#/$defs/ContextStringOrArray",
                    "Test/Test",
                );
                expect(id).toBe("/Test/Core#/$defs/ContextStringOrArray");
            });

            it("should ignore already mapped ID", () => {
                // @ts-expect-error private method
                const id = mdorim.mapFileId(
                    "/Test/Core#/$defs/ContextStringOrArray",
                );
                expect(id).toBe("/Test/Core#/$defs/ContextStringOrArray");
            });
        });

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
                // @ts-expect-error private method
                const parsed = mdorim.parseRef(schema as JSONSchema, "Test");
                expect(parsed.$ref).toBe("/Test#/definitions/Test");
            });

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
                const filterRequired = (required: string[]) =>
                    required.filter((r) => r !== "age");
                // @ts-expect-error private method
                const parsed = mdorim.parseRef(
                    schema as JSONSchema,
                    "Test",
                    filterRequired,
                );
                expect(parsed.required).toEqual(["name"]);
            });

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
                // @ts-expect-error private method
                const parsed = mdorim.parseRef(schema as JSONSchema, "Test");
                expect(parsed.required).toEqual(["name", "age"]);
            });
        });

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
                // @ts-expect-error private method
                const parsed = mdorim.parseSchema(schema as JSONSchema, "Test");
                expect(parsed.$ref).toBe("/Test#/definitions/Test");
                // id must be overridden by parseSchema second argument
                expect(parsed.$id).toBe("Test");
                expect(parsed.$schema).toBeUndefined();
            });
        });
    });
});
