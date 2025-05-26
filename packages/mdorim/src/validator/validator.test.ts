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
            "MdorimError: Schema core/Invalid not found",
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
            expect(deref.items.anyOf[0].title).toBe("title-uuid");
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
            expect(deref.items.oneOf[0].title).toBe("title-uuid");
        });
    });

    it("should get a schema by its id", async () => {
        const validator = new Validator("core/Workspace");
        const schema = await validator.getSchema("/core/Workspace");

        expect(schema).toBeDefined();
        expect(schema?.id).toBe("/core/Workspace");
    });
});
