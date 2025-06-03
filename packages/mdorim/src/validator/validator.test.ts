import { describe, expect, it, test } from "vitest";

import { Validator } from ".";
import { MdorimError } from "../errors";

describe("Validator", () => {
    it("should be defined", () => {
        const validator = new Validator("core/User");
        expect(validator).toBeDefined();
    });

    it("should return schemaPath", () => {
        const validator = new Validator("core/User");
        expect(validator.schemaPath).toBe("core/User");
    });

    describe("schema", () => {
        it("should return /core/User", async () => {
            const validator = new Validator("core/User");
            // @ts-ignore private method
            const schema = await validator.schema("core/User");
            expect(schema.id).toBe("/core/User");
        });

        it("should return /core/definitions#/definitions/number", async () => {
            const validator = new Validator("core/User");
            // @ts-ignore private method
            const schema = await validator.schema(
                "core/definitions#definitions/number",
            );
            expect(schema.type).toBe("number");
        });

        it("should return /core/definitions#/definitions/created_at", async () => {
            const validator = new Validator("core/User");
            // @ts-ignore private method
            const schema = await validator.schema(
                "core/definitions#definitions/created_at",
            );
            expect(schema.type).toBe("string");
            expect(schema.format).toBe("date-time");
        });
    });

    it("should validate", async () => {
        const validator = new Validator("core/User");
        const user = {
            name: "John Doe",
            email: "john@example.com",
        };

        expect(await validator.validate(user)).toBe(user);
    });

    it("should return a error when no schema found", async () => {
        const validator = new Validator("/core/Invalid");
        const error = await validator.validate({});

        expect(error).toBeInstanceOf(MdorimError);
        expect((error as MdorimError).message).toBe(
            "MdorimError: SchemaType core/Invalid not found",
        );
    });

    describe("should dereference", () => {
        test("anyOf schema", async () => {
            const validator = new Validator("core/User");

            const deref = await validator.dereference({
                id: "/test/anyOf",
                type: "array",
                items: {
                    anyOf: [
                        {
                            $ref: "/core/definitions#/definitions/uuid",
                        },
                        {
                            $ref: "/core/definitions#/definitions/name",
                        },
                    ],
                },
            });

            expect(deref).toBeDefined();
            expect(deref.id).toBe("/test/anyOf");
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
            const validator = new Validator("core/User");

            const deref = await validator.dereference({
                id: "/test/anyOf",
                type: "array",
                items: {
                    oneOf: [
                        {
                            $ref: "/core/definitions#/definitions/uuid",
                        },
                        {
                            $ref: "/core/definitions#/definitions/name",
                        },
                    ],
                },
            });

            expect(deref).toBeDefined();
            expect(deref.id).toBe("/test/anyOf");
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

    it("should get a schema by its id", async () => {
        const validator = new Validator("core/Workspace");
        const schema = await validator.getSchema("/core/Workspace");

        expect(schema).toBeDefined();
        expect(schema?.id).toBe("/core/Workspace");
    });

    describe("should return error", () => {
        const validator = new Validator("core/Workspace");

        it("simple error", () => {
            // @ts-expect-error private method
            const error = validator.error("Message");

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe("MdorimError: Message");
        });

        describe("error with ValidationError", () => {
            it("error with ValidationError[]", () => {
                // @ts-expect-error private method
                const error = validator.error("Message", [
                    {
                        property: "instance.name",
                        message: "should be string",
                    },
                ]);

                expect(error).toBeInstanceOf(MdorimError);

                expect(error.message).toBe("MdorimError: Message");

                expect(error.getErrors()).toEqual({
                    name: "should be string",
                });
            });
        });
    });
});
