import { describe, expect, test } from "vitest";

import { Validator } from "@/validator/validator";
import { MdorimError } from "@/errors";

describe("Group", () => {
    const mdorim = new Validator("/linked-art/entities/group/Group");

    describe("Should return errors", () => {
        test("Group is invalid", async () => {
            const error = await mdorim.validate({});

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe(
                "MdorimError: Validation failed for /linked-art/entities/Group",
            );
            expect((error as MdorimError).errors).toEqual({
                Group: 'requires property "_label"',
            });
        });

        test("Group with empty type", async () => {
            const valid = await mdorim.validate({
                _label: "Group",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                Group: 'requires property "type"',
            });
        });

        test("Group with wrong type", async () => {
            const valid = await mdorim.validate({
                _label: "Group",
                type: "",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                type: "does not exactly match expected constant: Group",
            });
        });
    });
});
