import { describe, expect, test } from "vitest";

import { parseObjectPath } from "./";

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
