import { I18n as I18nBase } from "i18n-js";

import { DefaultLocale, Locales } from "@/types";
import { translations } from "./translations";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";

/**
 * # I18n class for managing translations.
 */
export class I18n {
    private engine: I18nBase;
    private depth = 0;

    /**
     * ## Creates an instance of I18n.
     * @param locale - The locale to use for translations. Defaults to "pt-br".
     */
    constructor(
        locale: Locales = DefaultLocale,
        private readonly maxDepth = 10,
    ) {
        this.engine = new I18nBase();
        this.engine.defaultLocale = DefaultLocale;
        this.engine.locale = locale;
        Object.entries(translations).forEach(([key, value]) => {
            this.engine.store({ [key]: value });
        });
    }

    /**
     * ## Gets the current locale.
     * @returns The current locale.
     */
    get locale(): Locales {
        return this.engine.locale as Locales;
    }

    /**
     * ## Translates a given key using the i18n engine.
     * The key should be prefixed with "i18n:". If the translation is not found,
     * a warning is logged and the key itself is returned as a fallback.
     *
     * @param key - The translation key, prefixed with "i18n:".
     * @param options - Optional parameters for the translation.
     * @returns The translated string, or the key itself if no translation is found.
     */
    translate(key: string, options?: Record<string, unknown>): string {
        if (!key.startsWith("i18n:")) {
            return key;
        }
        key = key.replace("i18n:", "");
        const translation = this.engine.t(key, options);
        if (translation === key) {
            console.warn(
                `Translation for key "${key}" not found in locale "${this.locale}". Using the key as fallback.`,
            );
        }
        return translation;
    }

    /**
     * ## Translates a schema by translating its title and description properties, as well as the titles of its properties and items.
     *
     * @param schema - The schema to translate.
     * @returns The translated schema.
     */
    translateSchema(schema: Partial<JSONSchema>): Partial<JSONSchema> {
        if (this.depth >= this.maxDepth) {
            return schema as Partial<JSONSchema>;
        }

        const translated = Object.entries(schema).reduce(
            (acc, [key, value]) => {
                if (["title", "description"].includes(key)) {
                    const translation = this.translate(value as string);
                    acc[key] = translation;
                } else if (key === "properties") {
                    acc[key] = Object.entries(
                        value as Record<string, unknown>,
                    ).reduce(
                        (acc, [propKey, propValue]) => {
                            acc[propKey] = this.translateSchema(
                                propValue as JSONSchema,
                            );
                            return acc;
                        },
                        {} as Record<string, unknown>,
                    );
                } else if (key === "items") {
                    acc[key] = this.translateSchema(value as JSONSchema);
                } else {
                    acc[key] = value;
                }

                return acc;
            },
            {} as Record<string, unknown>,
        ) as JSONSchema;

        this.depth++;

        return translated;
    }
}
