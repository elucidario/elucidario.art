import { describe, expect, test } from "vitest";

import { Validator } from "@/validator/validator";
import { MdorimError } from "@/errors";

describe("Digital", () => {
    const mdorim = new Validator("/linked-art/entities/digital/Digital");

    describe("Should return errors", () => {
        test("Digital is invalid", async () => {
            const error = await mdorim.validate({});

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe(
                "MdorimError: Validation failed for /linked-art/entities/Digital",
            );
            expect((error as MdorimError).errors).toEqual({
                Digital: 'requires property "_label"',
            });
        });

        test("Digital with empty type", async () => {
            const valid = await mdorim.validate({
                _label: "Digital",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                Digital: 'requires property "type"',
            });
        });

        test("Digital with wrong type", async () => {
            const valid = await mdorim.validate({
                _label: "Digital",
                type: "",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                type: "does not exactly match expected constant: DigitalObject",
            });
        });
    });
});
