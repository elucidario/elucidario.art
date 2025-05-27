import { describe, expect, test } from "vitest";

import { Validator } from "@/validator/validator";
import { MdorimError } from "@/errors";

describe("Provenance", () => {
    const mdorim = new Validator("/linked-art/entities/provenance/Provenance");

    describe("Should return errors", () => {
        test("Provenance is invalid", async () => {
            const error = await mdorim.validate({});

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe(
                "MdorimError: Validation failed for /linked-art/entities/Provenance",
            );
            expect((error as MdorimError).errors).toEqual({
                Provenance: 'requires property "classified_as"',
            });
        });

        test("Provenance with empty type", async () => {
            const valid = await mdorim.validate({
                _label: "Provenance",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                Provenance: 'requires property "classified_as"',
                // Provenance: 'requires property "type"',
            });
        });

        test("Provenance with wrong type", async () => {
            const valid = await mdorim.validate({
                _label: "Provenance",
                type: "",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                Provenance: 'requires property "classified_as"',
                type: "does not exactly match expected constant: Activity",
            });
        });
    });
});
