import { describe, expect, test } from "vitest";

import { Validator } from "@/validator/validator";
import { MdorimError } from "@/errors";

describe("Person", () => {
    const mdorim = new Validator("/linked-art/entities/person/Person");

    describe("Should return errors", () => {
        test("Person is invalid", async () => {
            const error = await mdorim.validate({});

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe(
                "MdorimError: Validation failed for /linked-art/entities/Person",
            );
            expect((error as MdorimError).errors).toEqual({
                Person: 'requires property "_label"',
            });
        });

        test("Person with empty type", async () => {
            const valid = await mdorim.validate({
                _label: "Person",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                Person: 'requires property "type"',
            });
        });

        test("Person with wrong type", async () => {
            const valid = await mdorim.validate({
                _label: "Person",
                type: "",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                type: "does not exactly match expected constant: Person",
            });
        });
    });
});
