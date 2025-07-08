import { beforeAll, describe, expect, it } from "vitest";

import { Validator } from "@/application/Validator";
import { DefaultLocale, I18n, Mdorim } from "@elucidario/mdorim";
import { User } from "@/domain/models/core";

describe("Validator", { skip: false }, () => {
    let validator: Validator;

    beforeAll(() => {
        // Initialize the Validator instance before all tests
        validator = new Validator(new Mdorim(new I18n(DefaultLocale)));
    });

    describe("should validate entity correctly", () => {
        it("should throw an error if model is not defined", async () => {
            validator.model = undefined; // Simulate no model set
            await expect(
                async () => await validator.validateEntity(),
            ).rejects.toThrow(
                "Model is not defined. Please set the model before getting the schema.",
            );
        });

        it("should return true for valid entity", async () => {
            validator.setModel(
                new User({
                    type: "User",
                    username: "test_user",
                    email: "test_user@example.com",
                }),
            );

            const isValid = await validator.validateEntity();

            expect(isValid).toBe(true);
        });
    });
});
