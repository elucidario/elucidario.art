import { describe, expect, it } from "vitest";

import { Mdorim, MdorimError } from "./";

describe("Mdorim", () => {
    it("should be defined", () => {
        const mdorim = new Mdorim();
        expect(mdorim).toBeDefined();
    });

    it("should have schemas initialized", () => {
        const mdorim = new Mdorim();
        expect(mdorim.schemas.size).toBeGreaterThan(0);
        expect(mdorim.schemas.has("/core/User")).toBe(true);
    });

    it("should have validator initialized", () => {
        const mdorim = new Mdorim();
        expect(mdorim.getValidator()).toBeDefined();
    });

    it("should return a error when no schema found", () => {
        const mdorim = new Mdorim();
        const error = mdorim.validateEntity("/core/Invalid", {});

        expect(error).toBeInstanceOf(MdorimError);
        expect((error as MdorimError).message).toBe(
            "MdorimError: Schema /core/Invalid not found",
        );
    });
});
