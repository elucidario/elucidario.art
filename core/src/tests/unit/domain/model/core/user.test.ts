import { describe, expect, it } from "vitest";
import { User as UserType } from "@elucidario/mdorim";
import { User } from "@/domain/models/core";

describe("User Model", () => {
    it("should create a User instance with default values", () => {
        const user = new User();
        expect(user).toBeInstanceOf(User);
        expect(user.schema).toBe("/core/User");
    });

    it("should create a User instance with provided data", () => {
        const userData: UserType = {
            type: "User",
            username: "testuser",
            email: "testuser@example.com",
        };
        const user = new User(userData);
        expect(user).toBeInstanceOf(User);
        expect(user.schema).toBe("/core/User");
    });
});
