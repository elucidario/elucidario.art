import { describe, expect, it, test } from "vitest";
import { MdorimError } from "../mdorim.error";
import { isMdorimError, parseObjectPath } from "./utils";

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

describe("parseObjectPath", () => {
    const paths: [string, string, Record<string, unknown>][] = [
        [
            "user.name",
            "Henrique",
            {
                user: {
                    name: "Henrique",
                },
            },
        ],
        [
            "users[0]",
            "requires property role",
            {
                users: "requires property role",
            },
        ],
        [
            "users[0].name",
            "Henrique",
            {
                users: [
                    {
                        name: "Henrique",
                    },
                ],
            },
        ],
        [
            "users[0].company.name",
            "Elucidario",
            {
                users: [
                    {
                        company: { name: "Elucidario" },
                    },
                ],
            },
        ],
        [
            "users[0].companies[0].name",
            "Elucidario",
            {
                users: [
                    {
                        companies: [{ name: "Elucidario" }],
                    },
                ],
            },
        ],
        [
            "user.companies[0].name",
            "Elucidario",
            {
                user: {
                    companies: [{ name: "Elucidario" }],
                },
            },
        ],
    ];

    paths.forEach(([path, value, expected]) => {
        test(`should parse path "${path}" to object`, () => {
            const result = parseObjectPath(path, value);
            expect(result).toEqual(expected);
        });
    });
});
