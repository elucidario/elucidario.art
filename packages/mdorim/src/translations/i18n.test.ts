import { describe, expect, it } from "vitest";

import { I18n } from "./I18n";

describe("i18n", () => {
    it("should initialize with default locale", () => {
        const i18n = new I18n();
        expect(i18n).toBeDefined();
        expect(i18n.locale).toBe("pt-br");
    });

    it("should initialize with custom locale", () => {
        const i18n = new I18n("en-us");
        expect(i18n).toBeDefined();
        expect(i18n.locale).toBe("en-us");
    });

    it("should translate schema", () => {
        const i18n = new I18n();
        const schema = {
            id: "/workspace",
            title: "i18n:workspace",
            properties: {
                uuid: {
                    title: "i18n:uuid",
                },
            },
        };

        const translatedSchema = i18n.translateSchema(schema);
        expect(translatedSchema.title).toBe("Área de Trabalho");
        expect(translatedSchema.properties!.uuid.title).toBe("UUID");
    });
});
