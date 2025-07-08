import { describe, expect, it } from "vitest";
import { IdentifierOrName } from "@elucidario/mdorim";
import { NameOrIdentifier } from "@/domain/models/linked-art";

describe("NameOrIdentifier Model", { skip: false }, () => {
    it("should create a NameOrIdentifier instance with default values", () => {
        const name = new NameOrIdentifier();
        expect(name).toBeInstanceOf(NameOrIdentifier);
        expect(
            (name.schema as Map<string, string>).has(
                "/linked-art/Core#/$defs/Identifier",
            ),
        ).toBe(true);
        expect(
            (name.schema as Map<string, string>).has(
                "/linked-art/Core#/$defs/Name",
            ),
        ).toBe(true);
    });

    it("should create a NameOrIdentifier instance with provided data", () => {
        const test: IdentifierOrName = {
            type: "Identifier",
            _label: "Test NameOrIdentifier",
        };
        const identifier = new NameOrIdentifier(test);
        expect(identifier).toBeInstanceOf(NameOrIdentifier);
    });
});
