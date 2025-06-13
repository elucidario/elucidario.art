import { filterLinkedArtRequired, isMdorimError, parseSchema } from "@/utils";
import { MdorimError } from "@/errors";
import { I18n } from "@/translations";

import * as coreSchemas from "./schemas/core";
import * as linkedArtSchemas from "./schemas/linked-art";
import { SchemaID } from "@/types";

import { camelCase, startCase } from "lodash-es";

import {
    $RefParser,
    JSONSchema,
    FileInfo,
} from "@apidevtools/json-schema-ref-parser";

/**
 * # Schema Class
 *
 * This class is responsible for managing and retrieving JSON schemas.
 * It supports dereferencing schemas, translating them, and filtering required properties.
 * It uses the $RefParser library to handle schema references.
 */
export class Schema {
    private parser: $RefParser;
    private schemas: Map<string, JSONSchema> = new Map();

    /**
     * ## Schema constructor
     *
     * Initializes the Schema class with core and linked art schemas.
     * It also sets up the i18n instance for translations.
     *
     * @param defaultLocale - The default locale to use for translations (optional).
     */
    constructor(private i18n: I18n) {
        this.parser = new $RefParser();

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
     * ## Get a schema by its ID
     *
     * Retrieves a schema by its ID, which can be a full path or a reference to a sub-schema.
     * If the schema is not found, an error is thrown.
     *
     * @param id - The ID of the schema to retrieve.
     * @param required - Whether the schema should have required properties (default: true).
     * @returns The requested schema as a Partial<JSONSchema>.
     */
    public async getSchema(
        id: SchemaID,
        required?: boolean,
    ): Promise<Partial<JSONSchema>> {
        try {
            const [schemaId, rest] = id.split("#");

            let schema = this.schemas.get(schemaId);

            if (!schema) {
                throw this.error(`Schema ${schemaId} not found`);
            }

            if (rest) {
                const subSchemaPath = rest.startsWith("/")
                    ? rest.slice(1)
                    : rest;

                const subSchema = (
                    subSchemaPath.split("/") as Array<keyof JSONSchema>
                ).reduce((acc, cur) => {
                    if (acc && acc[cur] !== undefined) {
                        return acc[cur];
                    }
                }, schema) as JSONSchema | undefined;

                if (!subSchema) {
                    throw this.error(`Sub-schema ${rest} not found in ${id}`);
                }
                schema = subSchema;
            }

            required = typeof required !== "undefined" ? required : true;

            if (!required && typeof schema?.required !== "undefined") {
                schema.required = undefined;
            }

            return schema;
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * ## Translate a schema
     * Translates the title and description of a schema, as well as the titles of its properties and items.
     * @param schema - The schema to translate.
     * @returns The translated schema.
     */
    public translateSchema(schema: JSONSchema): JSONSchema {
        return this.i18n.translateSchema(schema);
    }

    /**
     * ## Dereference a schema
     * Dereferences a JSON schema, resolving any $ref references to their full definitions.
     *
     * @param schema - The JSON schema to dereference.
     * @returns The dereferenced schema as a Promise<JSONSchema>.
     */
    public async dereference(schema: JSONSchema) {
        try {
            const getter = this.getSchema.bind(this);

            return await this.parser.dereference(schema, {
                resolve: {
                    file: {
                        canRead: true,
                        async read(file: FileInfo) {
                            let url = file.url;
                            if (
                                !url.includes("mdorim") &&
                                url.includes("json")
                            ) {
                                const parts = file.url
                                    .replace(".json", "")
                                    .slice(1)
                                    .split("/");
                                const [namespace, name] = parts.splice(
                                    parts.length - 2,
                                    2,
                                );

                                url = `/${namespace}/${startCase(camelCase(name)).replace(" ", "")}`;
                            } else if (url.includes("mdorim")) {
                                // If the URL is a mdorim schema, we need to extract the namespace and name
                                // from the URL and use the getter to fetch the schema.
                                // Example: /mdorim/core/User.json -> /core/User

                                const parts = file.url
                                    .split("mdorim")[1]
                                    .replace(".json", "")
                                    .slice(1)
                                    .split("/");

                                const [namespace, name] = parts.splice(
                                    parts.length - 2,
                                    2,
                                );

                                url = `/${namespace}/${startCase(camelCase(name)).replace(" ", "")}`;
                            }

                            const deref = await getter(url);

                            if (!deref) {
                                throw new MdorimError(
                                    `Schema ${file.url} not found`,
                                );
                            }

                            return deref;
                        },
                    },
                },
            });
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * ## Create a MdorimError instance from ValidationError[]
     *
     * @param message - Error message
     * @param errors - Optional errors object
     * @returns - MdorimError - MdorimError instance
     */
    private error(
        error: unknown,
        errors?: Record<string, unknown>,
    ): MdorimError {
        if (isMdorimError(error)) {
            return error;
        }
        const message = typeof error === "string" ? error : String(error);
        return new MdorimError(message, errors);
    }
}
