import { describe, expect, it, test } from "vitest";

import { Mdorim, MdorimError } from "../../../";

describe("Workspace", () => {
    const mdorim = new Mdorim();

    describe("Should return errors", () => {
        test("Workspace is invalid", () => {
            const error = mdorim.validateEntity("/core/Workspace", {});

            expect(error).toBeInstanceOf(MdorimError);
            expect((error as MdorimError).message).toBe(
                "MdorimError: Validation failed for /core/Workspace",
            );
            expect((error as MdorimError).errors).toEqual({
                Workspace: 'requires property "name"',
            });
        });

        test("Workspace with empty users", () => {
            const valid = mdorim.validateEntity("/core/Workspace", {
                name: "My Workspace",
                users: [],
            });
            expect(valid).toBeInstanceOf(MdorimError);
        });

        test("Workspace users must have role and email", () => {
            const valid = mdorim.validateEntity("/core/Workspace", {
                name: "My Workspace",
                users: [
                    {
                        user: {
                            email: "teste@example.com",
                        },
                    },
                ],
            });

            expect(valid).toBeInstanceOf(MdorimError);
            expect((valid as MdorimError).errors).toEqual({
                users: 'requires property "role"',
            });
        });
    });
});
