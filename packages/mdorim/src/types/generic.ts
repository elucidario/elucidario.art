import { translations } from "@/translations";

export type UUID = string;

export type CreatedAt = string;

export type UpdatedAt = string;

export type Name = string;

export type Description = string;

export type Email = string;

export type Password = string;

export type EntityProps<T = unknown> = {
    uuid?: UUID;
    created_at?: CreatedAt;
    updated_at?: UpdatedAt;
} & T;

export type Locales = keyof typeof translations;

export const DefaultLocale = "pt-br";
