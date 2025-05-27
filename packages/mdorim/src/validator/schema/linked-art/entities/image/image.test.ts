import { describe, expect, test } from "vitest";

import { Validator } from "@/validator/validator";
import { MdorimError } from "@/errors";

describe("Image", () => {
    const mdorim = new Validator("/linked-art/entities/image/Image");

    describe("Should return errors", () => {
        test("Image is invalid", async () => {
            const error = await mdorim.validate({});

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe(
                "MdorimError: Validation failed for /linked-art/entities/Image",
            );
            expect((error as MdorimError).errors).toEqual({
                Image: 'requires property "_label"',
            });
        });

        test("Image with empty type", async () => {
            const valid = await mdorim.validate({
                _label: "Image",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                Image: 'requires property "type"',
            });
        });

        test("Image with wrong type", async () => {
            const valid = await mdorim.validate({
                _label: "Image",
                type: "",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                type: "does not exactly match expected constant: VisualItem",
            });
        });
    });
});
