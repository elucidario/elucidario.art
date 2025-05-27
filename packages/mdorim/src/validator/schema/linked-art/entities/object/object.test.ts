import { describe, expect, test } from "vitest";

import { Validator } from "@/validator/validator";
import { MdorimError } from "@/errors";

describe("Object", () => {
    const mdorim = new Validator("/linked-art/entities/object/PhysicalObject");

    describe("Should return errors", () => {
        test("Object is invalid", async () => {
            const error = await mdorim.validate({});

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe(
                "MdorimError: Validation failed for /linked-art/entities/PhysicalObject",
            );
            expect((error as MdorimError).errors).toEqual({
                PhysicalObject: 'requires property "_label"',
            });
        });

        test("Object with empty type", async () => {
            const valid = await mdorim.validate({
                _label: "Object",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                PhysicalObject: 'requires property "type"',
            });
        });

        test("Object with wrong type", async () => {
            const valid = await mdorim.validate({
                _label: "Object",
                type: "",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                type: "does not exactly match expected constant: HumanMadeObject",
            });
        });
    });
});
