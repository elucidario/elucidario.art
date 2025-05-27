import { describe, expect, test } from "vitest";

import { Validator } from "@/validator/validator";
import { MdorimError } from "@/errors";

describe("Event", () => {
    const mdorim = new Validator("/linked-art/entities/event/Event");

    describe("Should return errors", () => {
        test("Event is invalid", async () => {
            const error = await mdorim.validate({});

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe(
                "MdorimError: Validation failed for /linked-art/entities/Event",
            );
            expect((error as MdorimError).errors).toEqual({
                Event: 'requires property "_label"',
            });
        });

        test("Event with empty type", async () => {
            const valid = await mdorim.validate({
                _label: "Event",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                Event: 'requires property "type"',
            });
        });

        test("Event with wrong type", async () => {
            const valid = await mdorim.validate({
                _label: "Event",
                type: "",
            });
            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                type: "is not one of enum values: Period,Event,Activity",
            });
        });
    });
});
