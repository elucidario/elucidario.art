import { describe, expect, it, test } from "vitest";

import Mdorim from "./mdorim";

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

    describe("should validate entities", () => {
        const mdorim = new Mdorim();

        test("should throw when no schema found", () => {
            expect(() => mdorim.validateEntity("/core/Invalid", {})).toThrow(
                "mdorim: Schema /core/Invalid not found",
            );
        });

        describe("should validate an User", () => {
            test("throw when User is invalid", () => {
                expect(() => mdorim.validateEntity("/core/User", {})).toThrow();
            });

            test("User", () => {
                const valid = mdorim.validateEntity("/core/User", {
                    name: "John Doe",
                    email: "john@example.com",
                });
                expect(valid).toBe(true);
            });

            test("User with all properties", () => {
                const valid = mdorim.validateEntity("/core/User", {
                    name: "John Doe",
                    email: "john@example.com",
                    password: "password",
                    userId: "12345678-1234-1234-1234-123456789012",
                });

                expect(valid).toBe(true);
            });
        });
    });
});
