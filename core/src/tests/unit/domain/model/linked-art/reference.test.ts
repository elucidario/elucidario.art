import { describe, expect, it } from "vitest";
import { Reference as ReferenceType, GenericType } from "@elucidario/mdorim";
import { Reference } from "@/domain/models/linked-art";

describe("Reference Model", { skip: false }, () => {
    it("should create a Reference instance with default values", () => {
        const user = new Reference();
        expect(user).toBeInstanceOf(Reference);
        expect(user.schema).toBe("/linked-art/Core#/$defs/AnyRef");
    });

    it("should create a Reference instance with provided data", () => {
        const concept: ReferenceType<GenericType> = {
            type: "Language",
            _label: "Test Reference",
            id: "https://example.com/language/test-reference",
        };
        const user = new Reference(concept);
        expect(user).toBeInstanceOf(Reference);
        expect(user.schema).toBe("/linked-art/Core#/$defs/AnyRef");
    });
});
