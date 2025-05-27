import { describe, expect, test } from "vitest";

import { Validator } from "@/validator/validator";
import { MdorimError } from "@/errors";

describe("Text", () => {
    const mdorim = new Validator("/linked-art/entities/text/Text");

    describe("Should return errors", () => {
        test("Text is invalid", async () => {
            const error = await mdorim.validate({});

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe(
                "MdorimError: Validation failed for /linked-art/entities/Text",
            );
            expect((error as MdorimError).errors).toEqual({
                Text: 'requires property "_label"',
            });
        });

        test("Text with empty type", async () => {
            const valid = await mdorim.validate({
                _label: "Text",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                Text: 'requires property "type"',
            });
        });

        test("Text with wrong type", async () => {
            const valid = await mdorim.validate({
                _label: "Text",
                type: "",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                type: "does not exactly match expected constant: LinguisticObject",
            });
        });
    });
});
