import { describe, expect, test } from "vitest";

import { Validator } from "@/validator/validator";
import { MdorimError } from "@/errors";

describe("Place", () => {
    const mdorim = new Validator("/linked-art/entities/place/Place");

    describe("Should return errors", () => {
        test("Place is invalid", async () => {
            const error = await mdorim.validate({});

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe(
                "MdorimError: Validation failed for /linked-art/entities/Place",
            );
            expect((error as MdorimError).errors).toEqual({
                Place: 'requires property "_label"',
            });
        });

        test("Place with empty type", async () => {
            const valid = await mdorim.validate({
                _label: "Place",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                Place: 'requires property "type"',
            });
        });

        test("Place with wrong type", async () => {
            const valid = await mdorim.validate({
                _label: "Place",
                type: "",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                type: "does not exactly match expected constant: Place",
            });
        });
    });
});
