import { describe, expect, it } from "vitest";
import { Concept as ConceptType } from "@elucidario/mdorim";
import { Concept } from "@/domain/models/linked-art";

describe("Concept Model", { skip: false }, () => {
    it("should create a Concept instance with default values", () => {
        const user = new Concept();
        expect(user).toBeInstanceOf(Concept);
        expect(user.schema).toBe("/linked-art/Concept");
    });

    it("should create a Concept instance with provided data", () => {
        const concept: ConceptType = {
            type: "Concept",
            _label: "Test Concept",
        };
        const user = new Concept(concept);
        expect(user).toBeInstanceOf(Concept);
        expect(user.schema).toBe("/linked-art/Concept");
    });
});
