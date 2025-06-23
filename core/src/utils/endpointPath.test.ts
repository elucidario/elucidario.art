import { describe, expect, it } from "vitest";
import { endpointPath } from "./endpointPath";

describe("endpointPath", () => {
    it("should return the correct endpoint for given parameters", () => {
        expect(endpointPath("auth", "register")).toBe("/auth/register");
    });

    it("should handle leading and trailing slashes", () => {
        expect(endpointPath("/auth/", "/register/")).toBe("/auth/register");
        expect(endpointPath("auth", "/register")).toBe("/auth/register");
        expect(endpointPath("/auth", "register/")).toBe("/auth/register");
    });

    it("should ignore empty strings and undefined values", () => {
        expect(endpointPath("auth", "", "register")).toBe("/auth/register");
        // @ts-expect-error Testing undefined value
        expect(endpointPath("auth", undefined, "register")).toBe(
            "/auth/register",
        );
        expect(endpointPath("", "auth", "register")).toBe("/auth/register");
    });

    it("should return an empty string if no valid parts are provided", () => {
        expect(endpointPath()).toBe("/");
        expect(endpointPath("", "", "")).toBe("/");
        // @ts-expect-error Testing undefined value
        expect(endpointPath(undefined, undefined)).toBe("/");
    });
});
