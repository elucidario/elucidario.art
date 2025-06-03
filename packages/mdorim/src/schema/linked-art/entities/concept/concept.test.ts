import { describe, expect, test } from "vitest";

import { Validator } from "@/validator/validator";
import { MdorimError } from "@/errors";

describe("Concept", () => {
    const mdorim = new Validator("/linked-art/entities/concept/Concept");

    describe("Should return errors", () => {
        test("Concept is invalid", async () => {
            const error = await mdorim.validate({});

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe(
                "MdorimError: Validation failed for /linked-art/entities/Concept",
            );
            expect((error as MdorimError).errors).toEqual({
                Concept: 'requires property "_label"',
            });
        });

        test("Concept with empty type", async () => {
            const valid = await mdorim.validate({
                _label: "Concept",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                Concept: 'requires property "type"',
            });
        });

        test("Concept with wrong type", async () => {
            const valid = await mdorim.validate({
                _label: "Concept",
                type: "",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                type: "is not one of enum values: Type,Currency,Material,Language,MeasurementUnit",
            });
        });
    });
});
