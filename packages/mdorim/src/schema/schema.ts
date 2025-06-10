import { filterLinkedArtRequired, isMdorimError, parseSchema } from "@/utils";
import { MdorimError } from "@/errors";
import { I18n } from "@/translations";

import * as coreSchemas from "./schemas/core";
import * as linkedArtSchemas from "./schemas/linked-art";
import { GetSchemaOptions, SchemaID, SchemaType } from "@/types";
import { DefaultLocale, Locales } from "@/types";

export class Schema {
    schemas: Map<string, SchemaType> = new Map();

    private i18n: I18n;

    /**
     * ## Schema constructor
     *
     * Initializes the Schema class with core and linked art schemas.
     * It also sets up the i18n instance for translations.
     *
     * @param defaultLocale - The default locale to use for translations (optional).
     */
    constructor(private defaultLocale: Locales = DefaultLocale) {
        this.i18n = new I18n(this.defaultLocale);

        for (const [key, value] of Object.entries(coreSchemas)) {
            if (typeof value === "object" && value !== null) {
                const id = `/core/${key}`;
                this.schemas.set(
                    id,
                    parseSchema(value, id, filterLinkedArtRequired),
                );
            }
        }

        for (const [key, value] of Object.entries(linkedArtSchemas)) {
            if (typeof value === "object" && value !== null) {
                const id = `/linked-art/${key}`;
                this.schemas.set(
                    id,
                    parseSchema(value, id, filterLinkedArtRequired),
                );
            }
        }
    }

    /**
     * ## Get schema by ID
     *
     * @param id - SchemaType ID to get
     * @returns - SchemaType object
     */
    public getSchema(
        id: SchemaID,
        options?: GetSchemaOptions,
    ): Partial<SchemaType> {
        try {
            const [schemaId, rest] = id.split("#");

            let schema = this.schemas.get(schemaId);

            if (rest) {
                const subSchemaPath = rest.startsWith("/")
                    ? rest.slice(1)
                    : rest;

                const subSchema = (
                    subSchemaPath.split("/") as Array<keyof SchemaType>
                ).reduce((acc, cur) => {
                    if (acc && acc[cur]) {
                        return acc[cur];
                    }
                    return undefined;
                }, schema) as SchemaType | undefined;

                if (!subSchema) {
                    throw this.error(`Sub-schema ${rest} not found in ${id}`);
                }
                schema = subSchema;
            }

            let required =
                typeof options?.required !== "undefined"
                    ? options.required
                    : true;

            if (!required && typeof schema?.required !== "undefined") {
                schema.required = undefined;
            }

            if (options?.translate && options?.deref) {
                return this.i18n.translateSchema(
                    this.dereference(schema as SchemaType, options),
                );
            } else if (options?.translate) {
                return this.i18n.translateSchema(schema as SchemaType);
            } else if (options?.deref) {
                return this.dereference(schema as SchemaType, options);
            } else {
                return schema as SchemaType;
            }
        } catch (error) {
            if (isMdorimError(error)) {
                throw error;
            }
            throw this.error(`Schema ${id} not found`);
        }
    }

    /**
     * ## Dereference schema
     *
     * This method dereferences the schema by replacing $ref with the actual schema.
     * It recursively traverses the schema and replaces all $ref with the actual schema.
     * It also handles nested schemas and properties.
     *
     * @param schema - SchemaType to dereference
     * @param parent - Parent key for the schema
     * @returns - Dereferenced schema
     */
    public dereference(
        schema: Partial<SchemaType>,
        options?: GetSchemaOptions,
        parent?: string,
    ): Partial<SchemaType> {
        return Object.entries(schema).reduce(
            (asyncAcc, [key, value]) => {
                const acc = asyncAcc;
                if (key === "$ref") {
                    const derefSchema = this.getSchema(value, options);
                    acc[parent!] = this.dereference(
                        derefSchema,
                        options,
                        parent,
                    );
                } else if (["properties", "items"].includes(key)) {
                    acc[key] = this.dereference(
                        value as SchemaType,
                        options,
                        parent,
                    );
                } else if (typeof value === "object" && !Array.isArray(value)) {
                    const nestedDeref = this.dereference(
                        value as SchemaType,
                        options,
                        key,
                    );
                    acc[key] = nestedDeref[key as keyof SchemaType];
                } else if (Array.isArray(value)) {
                    acc[key] = value.map((item) => {
                        if (typeof item === "object") {
                            const derefItem = this.dereference(
                                item as SchemaType,
                                options,
                                key,
                            );
                            return derefItem[key as keyof SchemaType];
                        }
                        return item;
                    });
                } else {
                    acc[key] = value;
                }

                return acc;
            },
            {} as Record<string, unknown>,
        );
    }

    /**
     * ## Create a MdorimError instance from ValidationError[]
     *
     * @param message - Error message
     * @param errors - Optional errors object
     * @returns - MdorimError - MdorimError instance
     */
    private error(
        message: string,
        errors?: Record<string, unknown>,
    ): MdorimError {
        return new MdorimError(`SchemaError: ${message}`, errors);
    }
}
