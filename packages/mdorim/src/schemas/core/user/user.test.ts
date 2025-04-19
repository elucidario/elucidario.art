import { describe, expect, it } from "vitest";

import { Mdorim, MdorimError } from "../../../";

describe("User", () => {
    const mdorim = new Mdorim();

    it("should return a error when User is invalid", () => {
        const error = mdorim.validateEntity("/core/User", {});

        expect(error).toBeInstanceOf(MdorimError);
        expect((error as MdorimError).message).toBe(
            "MdorimError: Validation failed for /core/User",
        );
        expect((error as MdorimError).errors).toEqual({
            User: 'requires property "email"',
        });
    });

    it("User", () => {
        const valid = mdorim.validateEntity("/core/User", {
            name: "John Doe",
            email: "john@example.com",
        });
        expect(valid).toBe(true);
    });

    it("User with all properties", () => {
        const valid = mdorim.validateEntity("/core/User", {
            name: "John Doe",
            email: "john@example.com",
            password: "password",
            userId: "12345678-1234-1234-1234-123456789012",
            created_at: "2023-10-01T00:00:00Z",
            updated_at: "2023-10-01T00:00:00Z",
        });

        expect(valid).toBe(true);
    });
});
