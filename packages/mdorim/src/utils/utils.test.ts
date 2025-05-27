import { describe, expect, it } from "vitest";
import { MdorimError } from "../errors";
import { isMdorimError } from "./";

describe("isMdorimError", () => {
    it("should return true for MdorimError instance", () => {
        const error = new MdorimError("Test error");
        expect(isMdorimError(error)).toBe(true);
    });

    it("should return true for object with name property", () => {
        const error = { name: "MdorimError" };
        expect(isMdorimError(error)).toBe(true);
    });

    it("should return false for other objects", () => {
        const error = { message: "Not an MdorimError" };
        expect(isMdorimError(error)).toBe(false);
    });

    it("should return false for null", () => {
        const error = null;
        expect(isMdorimError(error)).toBe(false);
    });

    it("should return false for undefined", () => {
        const error = undefined;
        expect(isMdorimError(error)).toBe(false);
    });
});
