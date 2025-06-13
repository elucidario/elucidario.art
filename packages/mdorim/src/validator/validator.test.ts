import { describe, expect, it } from "vitest";

import { Validator } from ".";
import { MdorimError } from "../errors";
import { Schema } from "@/schema";
import { DefaultLocale } from "@/types";
import { I18n } from "@/translations";

describe("Validator", () => {
    it("should be defined", () => {
        const validator = new Validator(new Schema(new I18n(DefaultLocale)));
        expect(validator).toBeDefined();
    });

    it("should validate", async () => {
        const validator = new Validator(new Schema(new I18n(DefaultLocale)));
        const user = {
            username: "John-Doe",
            email: "john@example.com",
        };

        expect(await validator.validate("/core/User", user)).toBeTruthy();
    });

    it("should throw a error when no schema found", async () => {
        const validator = new Validator(new Schema(new I18n(DefaultLocale)));
        await expect(validator.validate("/core/Invalid", {})).rejects.toThrow(
            MdorimError,
        );
    });

    describe("should return error", () => {
        const validator = new Validator(new Schema(new I18n(DefaultLocale)));

        it("simple error", () => {
            // @ts-expect-error private method
            const error = validator.error("Message");

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe("MdorimError: Message");
        });

        describe("error with ValidationError", () => {
            it("error with ValidationError[]", () => {
                // @ts-expect-error private method
                const error = validator.error("Message", [
                    {
                        property: "instance.name",
                        message: "should be string",
                    },
                ]);

                expect(error).toBeInstanceOf(MdorimError);

                expect(error.message).toBe("MdorimError: Message");

                expect(error.getErrors()).toEqual({
                    name: "should be string",
                });
            });
        });
    });
});
