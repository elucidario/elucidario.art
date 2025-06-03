import { I18n as I18nBase } from "i18n-js";

import { SchemaType } from "@/schema/types";
import { Locales } from "@/types";
import { translations } from ".";

/**
 * # I18n class for managing translations.
 */
export class I18n {
    private engine: I18nBase;

    /**
     * ## Creates an instance of I18n.
     * @param locale - The locale to use for translations. Defaults to "pt-br".
     */
    constructor(locale: Locales = "pt-br") {
        this.engine = new I18nBase();
        this.engine.defaultLocale = "pt-br";
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
    translateSchema(schema: SchemaType): SchemaType {
        return Object.entries(schema).reduce(
            (acc, [key, value]) => {
                if (["title", "description"].includes(key)) {
                    const translation = this.translate(value);
                    acc[key] = translation;
                } else if (key === "properties") {
                    acc[key] = Object.entries(
                        value as Record<string, unknown>,
                    ).reduce(
                        (acc, [propKey, propValue]) => {
                            acc[propKey] = this.translateSchema(
                                propValue as SchemaType,
                            );
                            return acc;
                        },
                        {} as Record<string, unknown>,
                    );
                } else if (key === "items") {
                    acc[key] = this.translateSchema(value as SchemaType);
                } else {
                    acc[key] = value;
                }

                return acc;
            },
            {} as Record<string, unknown>,
        ) as SchemaType;
    }
}
