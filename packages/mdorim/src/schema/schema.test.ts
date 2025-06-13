import { describe, expect, it, test } from "vitest";

import { Schema } from "./schema";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { I18n } from "@/translations";

describe.only("Schema", () => {
    const i18n = new I18n("pt-br");

    it("should create a Schema instance", () => {
        const schema = new Schema(i18n);
        expect(schema).toBeDefined();
    });

    describe("getSchema", () => {
        it("should return /core/User", async () => {
            const schemas = new Schema(i18n);

            const schema = await schemas.getSchema("/core/User");
            expect(schema.$id).toBe("/core/User");
            expect((schema.properties?.uuid as JSONSchema).$ref).toBe(
                "core/definitions.json#/$defs/uuid",
            );
        });

        it("should return /core/definitions.json#/$defs/number", async () => {
            const schemas = new Schema(i18n);

            const schema = await schemas.getSchema(
                "/core/Definitions#/$defs/number",
            );

            expect(schema.type).toBe("number");
        });

        it("should return /core/definitions.json#$defs/number", async () => {
            const schemas = new Schema(i18n);

            const schema = await schemas.getSchema(
                "/core/Definitions#$defs/number",
            );

            expect(schema.type).toBe("number");
        });

        it("should return /core/definitions.json#/$defs/created_at", async () => {
            const schemas = new Schema(i18n);

            const schema = await schemas.getSchema(
                "/core/Definitions#/$defs/created_at",
            );
            expect(schema.type).toBe("string");
            expect(schema.format).toBe("date-time");
        });

        it("should remove required property", async () => {
            const schemas = new Schema(i18n);

            const schema = await schemas.getSchema("/core/User", false);

            expect(schema.$id).toBe("/core/User");
            expect(schema.title).toBe("i18n:user");
            expect((schema.properties?.uuid as JSONSchema).$ref).toBe(
                "core/definitions.json#/$defs/uuid",
            );
            expect(schema.required).toBeUndefined();
        });

        describe("errors", () => {
            it("should throw error if schema not found", async () => {
                const schemas = new Schema(i18n);

                await expect(
                    schemas.getSchema("/core/NonExistent"),
                ).rejects.toThrow(
                    "MdorimError: Schema /core/NonExistent not found",
                );
            });

            it("should throw error if nested schema is not found", async () => {
                const schemas = new Schema(i18n);

                await expect(
                    schemas.getSchema("/core/Workspace#/$defs/notFound"),
                ).rejects.toThrow(
                    "MdorimError: Sub-schema /$defs/notFound not found in /core/Workspace#/$defs/notFound",
                );
            });
        });
    });

    describe("should dereference", () => {
        it("should have a property from linked-art in mdorim", async () => {
            const schemas = new Schema(i18n);

            const schema = await schemas.getSchema("/core/Workspace");
            const deref = await schemas.dereference(schema);

            expect(deref.$id).toBe("/core/Workspace");
            expect(deref.properties?.organizations).toBeDefined();
            expect((deref.properties?.organizations as JSONSchema).type).toBe(
                "array",
            );
        });

        it("should return dereferenced schema", async () => {
            const schemas = new Schema(i18n);

            const schema = await schemas.getSchema("/core/User");
            const deref = await schemas.dereference(schema);
            expect(deref.$id).toBe("/core/User");
            expect((deref.properties?.uuid as JSONSchema).type).toBe("string");
            expect((deref.properties?.uuid as JSONSchema).format).toBe("uuid");
            expect((deref.properties?.uuid as JSONSchema).title).toBe(
                "i18n:uuid",
            );
        });

        test("anyOf schema", async () => {
            const validator = new Schema(i18n);

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
            // @ts-ignore
            expect(deref.items.anyOf).toBeDefined();
            // @ts-ignore
            expect(deref.items.anyOf[0]).toBeDefined();
            // @ts-ignore
            expect(deref.items.anyOf[0].$ref).toBeUndefined();
            // @ts-ignore
            expect(deref.items.anyOf[0].title).toBe("i18n:uuid");
        });

        test("oneOf schema", async () => {
            const validator = new Schema(i18n);

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

    describe("should translate schema", () => {
        it("should return translated schema", async () => {
            const schemas = new Schema(i18n);

            const schema = await schemas.getSchema("/core/User");
            const translatedSchema = schemas.translateSchema(schema);

            expect(translatedSchema.$id).toBe("/core/User");
            expect(translatedSchema.title).toBe("Usuário");
        });

        it("should return dereferenced and translated schema", async () => {
            const schemas = new Schema(i18n);

            const schema = await schemas.getSchema("/core/User");
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
                    const schemas = new Schema(i18n);

                    const schema = {
                        // $id: "/core/NonExistent",
                        type: "object",
                        properties: {
                            nonexistent: {
                                $ref: "/core/NonExistent",
                            }
                        }
                    }

                    await expect(
                        await schemas.dereference(schema as JSONSchema),
                    ).rejects.toThrow(
                        "MdorimError: Schema /core/NonExistent not found",
                    );
                });
            })
        });
    });
});
