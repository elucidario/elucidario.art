import { describe, expect, it, test } from "vitest";

import { MdorimError } from "./mdorim.error";

describe("MdorimError", () => {
    it("should create an instance with a message and errors", () => {
        const error = new MdorimError("Validation failed", {
            name: "Name is required",
        });
        expect(error).toBeInstanceOf(MdorimError);
        expect(error.message).toBe("MdorimError: Validation failed");
        expect(error.errors).toEqual({ name: "Name is required" });
    });

    it("should return errors using getErrors method", () => {
        const error = new MdorimError("Validation failed", {
            name: "Name is required",
        });
        expect(error.getErrors()).toEqual({ name: "Name is required" });
    });

    it("should add an error using addError method", () => {
        const error = new MdorimError("Validation failed");
        error.addError("email", "Email is required");
        expect(error.errors).toEqual({ email: "Email is required" });
    });

    it("should chain addError calls", () => {
        const error = new MdorimError("Validation failed");
        error
            .addError("name", "Name is required")
            .addError("email", "Email is required");
        expect(error.errors).toEqual({
            name: "Name is required",
            email: "Email is required",
        });
    });
});
