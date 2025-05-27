import { describe, expect, test } from "vitest";

import { Validator } from "@/validator/validator";
import { MdorimError } from "@/errors";

describe("Set", () => {
    const mdorim = new Validator("/linked-art/entities/set/Set");

    describe("Should return errors", () => {
        test("Set is invalid", async () => {
            const error = await mdorim.validate({});

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe(
                "MdorimError: Validation failed for /linked-art/entities/Set",
            );
            expect((error as MdorimError).errors).toEqual({
                Set: 'requires property "_label"',
            });
        });

        test("Set with empty type", async () => {
            const valid = await mdorim.validate({
                _label: "Set",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                Set: 'requires property "type"',
            });
        });

        test("Set with wrong type", async () => {
            const valid = await mdorim.validate({
                _label: "Set",
                type: "",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                type: "does not exactly match expected constant: Set",
            });
        });
    });
});
