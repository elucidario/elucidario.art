import { translations } from "@/translations";

export type UUID = string;

export type GenericType = string;

export type _Label = string;

export type ID = string;

export type PreferredTerm = string;

export type Description = string;

export type Email = string;

export type Password = string;

export type LanguageTag = string;

export type Format = string;

export type Content = string;

export type Value = number;

/**
 * Represents a Well-Known Text (WKT) format for representing geometric objects.
 * @link https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry
 * @example
 * const point: WKT = "POINT(30 10)";
 * const lineString: WKT = "LINESTRING(30 10, 10 30, 40 40)";
 */
export type WKT = string;

export type Locales = keyof typeof translations;

export const DefaultLocale: Locales = "pt-BR";

export type NoUUID<T> = Omit<T, "uuid">;
