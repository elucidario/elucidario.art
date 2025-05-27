import { describe, expect, test } from "vitest";

import { Validator } from "@/validator";
import { MdorimError } from "@/errors";

describe("Abstract", () => {
    const mdorim = new Validator("linked-art/entities/abstract/Abstract");

    describe("Should return errors", () => {
        test("Abstract is invalid", async () => {
            const error = await mdorim.validate({});

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe(
                "MdorimError: Validation failed for /linked-art/entities/Abstract",
            );
            expect((error as MdorimError).errors).toEqual({
                Abstract: 'requires property "_label"',
            });
        });

        test("Abstract with empty type", async () => {
            const valid = await mdorim.validate({
                _label: "Abstract",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                Abstract: 'requires property "type"',
            });
        });

        test("Abstract with wrong type", async () => {
            const valid = await mdorim.validate({
                _label: "Abstract",
                type: "",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                type: "does not exactly match expected constant: PropositionalObject",
            });
        });
    });
});
