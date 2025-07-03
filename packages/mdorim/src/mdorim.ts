import Ajv, { SchemaObject, Options } from "ajv";
import localize from "ajv-i18n";
import addFormats from "ajv-formats";
import { camelCase, startCase } from "lodash-es";
import {
    $RefParser,
    JSONSchema,
    FileInfo,
} from "@apidevtools/json-schema-ref-parser";
import { AnyValidateFunction } from "ajv/dist/core";

import { filterLinkedArtRequired, isMdorimError } from "@/utils";
import { MdorimError } from "@/errors";
import { I18n } from "@/translations";

import Schemas from "@/schemas";
import { SchemaID } from "@/types";

export { SchemaObject }; // Re-export SchemaObject from Ajv so it can be used in other parts of the application

/**
 * # Mdorim Class
 *
 * This class is responsible for managing and retrieving JSON schemas.
 * It supports dereferencing schemas, translating them, and filtering required properties.
 * It uses the $RefParser library to handle schema references.
 */
export class Mdorim {
    private parser: $RefParser;
    private validator: Ajv;

    protected schemas: Set<string> = new Set();

    /**
     * ## Mdorim constructor
     *
     * Initializes the Mdorim class with core and linked art schemas.
     * It also sets up the i18n instance for translations.
     *
     * @param defaultLocale - The default locale to use for translations (optional).
     */
    constructor(
        private i18n: I18n,
        ajvOptions?: Options,
    ) {
        this.parser = new $RefParser();
        this.validator = new Ajv({
            allErrors: false,
            strict: false,
            ...ajvOptions,
        });
        addFormats(this.validator);

        for (const [key, value] of Object.entries(Schemas.Core)) {
            if (typeof value === "object" && value !== null) {
                const id = `/core/${key}`;
                this.schemas.add(id);
                this.validator.addSchema(
                    this.parseSchema(
                        value as JSONSchema,
                        id,
                        filterLinkedArtRequired,
                    ),
                );
            }
        }

        for (const [key, value] of Object.entries(Schemas.LinkedArt)) {
            if (typeof value === "object" && value !== null) {
                const id = `/linked-art/${key}`;
                this.schemas.add(id);
                this.validator.addSchema(
                    this.parseSchema(
                        value as JSONSchema,
                        id,
                        filterLinkedArtRequired,
                    ),
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
    public getSchema(id: SchemaID, required?: boolean) {
        try {
            const validator = this.getValidator(id);

            const schema = validator.schema as SchemaObject;

            if (required === false && typeof schema.required !== "undefined") {
                // If required is false, we remove the required property from the schema
                schema.required = undefined;
            }

            return schema;
        } catch (error) {
            throw this.error(`Schema ${id} not found`, { id, error });
        }
    }

    /**
     * ## Get all schema references
     *
     * Retrieves all schema references that have been added to the Mdorim instance.
     * This includes both core and linked art schemas.
     *
     * @returns An array of schema references as strings.
     */
    public getSchemasRefs(): string[] {
        return Array.from(this.schemas);
    }

    /**
     * ## Get a validator by its ID
     *
     * Retrieves a validator function for the schema with the given ID.
     * If the schema is not found, an error is thrown.
     *
     * @param id - The ID of the schema to retrieve the validator for.
     * @returns The validator function for the schema.
     */
    public getValidator(id: SchemaID): AnyValidateFunction {
        const schema = this.validator.getSchema(id);
        if (!schema) {
            throw this.error(`Validator ${id} not found`);
        }
        return schema;
    }

    /**
     * ## Validate a value against a schema
     * @param id - The ID of the schema to validate.
     * @param value - The value to validate against the schema.
     * @returns A promise that resolves to true if the value is valid, or false if it is not.
     */
    public async validate(id: SchemaID, value: unknown): Promise<boolean> {
        const validator = this.getValidator(id);
        const valid = await validator(value);

        if (!valid) {
            const errors = validator.errors || [];
            localize[this.i18n.locale](validator.errors); // Localize errors to the current locale

            throw this.error("Validation failed", {
                id,
                errors: errors.reduce(
                    (acc, error) => {
                        const key = error.instancePath.slice(1) || id;
                        acc[key] = error.message ?? "";
                        return acc;
                    },
                    {} as Record<string, string>,
                ),
            });
        }

        return valid;
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
            const pathToId = this.pathToId.bind(this);

            return await this.parser.dereference(schema, {
                resolve: {
                    file: {
                        canRead: true,
                        read(file: FileInfo) {
                            const url = pathToId(file.url);

                            const deref = getter(url);

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
     * ## Map a file path to a Mdorim Schema ID
     * This method converts a file path to a Mdorim Schema ID.
     * It handles both mdorim schemas and regular JSON schemas.
     *
     * @param path - The file path to map.
     * @returns The mapped Mdorim Schema ID.
     */
    public pathToId(path: string): SchemaID {
        path = path.split("#")[0]; // Remove fragment identifier if present

        let schemaId = path;
        if (!path.includes("mdorim") && path.includes("json")) {
            const parts = path.replace(".json", "").slice(1).split("/");
            const [namespace, name] = parts.splice(parts.length - 2, 2);

            schemaId = `/${namespace}/${startCase(camelCase(name)).replace(" ", "")}`;
        } else if (path.includes("mdorim")) {
            // If the URL is a mdorim schema, we need to extract the namespace and name
            // from the URL and use the getter to fetch the schema.
            // Example: /mdorim/core/User.json -> /core/User

            const parts = path
                .split("mdorim")[1]
                .replace(".json", "")
                .slice(1)
                .split("/");

            const [namespace, name] = parts.splice(parts.length - 2, 2);

            schemaId = `/${namespace}/${startCase(camelCase(name)).replace(" ", "")}`;
        }

        return schemaId as SchemaID;
    }

    /**
     * ## Map a file ID/path to a Mdorim Schema ID
     * @param value - The file ID/path to map
     * @param namespace - The namespace to use for the mapping
     * @returns The mapped file ID
     */
    private mapFileId(value: string, namespace?: string): string {
        if (!namespace) {
            namespace = "";
        }
        namespace = namespace.startsWith("/") ? namespace : `/${namespace}`;

        let id = "";

        if (value.startsWith("#")) {
            id = `${namespace}${value}`;
        } else if (value.includes(".json")) {
            const primaryNamespace = namespace.split("/")[1];
            const [file, hash] = value.replace(".json", "").split("#");
            id = `/${primaryNamespace}/${startCase(camelCase(file)).replace(" ", "")}#${hash}`;
        } else {
            id = value;
        }

        return id;
    }

    /**
     * ## Parse a JSON Schema reference
     * @param schema - The JSON Schema to parse
     * @param base - The base URL to use for resolving references
     * @param filterRequired - A function to filter required properties
     * @returns The parsed JSON Schema
     *
     * @notes
     * - It is for internal use only, don't use it outside of this package.
     */
    private parseRef(
        schema: JSONSchema,
        base: string,
        filterRequired?: (required: string[]) => string[],
    ): JSONSchema {
        return Object.entries(schema).reduce((acc, [key, value]) => {
            if (key === "$ref") {
                acc[key as keyof JSONSchema] = this.mapFileId(value, base);
            } else if (key === "required") {
                acc[key as keyof JSONSchema] = filterRequired
                    ? filterRequired(value as string[])
                    : value;
            } else if (typeof value === "object" && !Array.isArray(value)) {
                const nestedDeref = this.parseRef(value, base, filterRequired);
                acc[key as keyof JSONSchema] = nestedDeref;
            } else if (Array.isArray(value)) {
                acc[key as keyof JSONSchema] = value.map((item) => {
                    if (typeof item === "object") {
                        return this.parseRef(item, base, filterRequired);
                    }
                    return item;
                });
            } else {
                acc[key as keyof JSONSchema] = value;
            }

            return acc;
        }, {} as JSONSchema);
    }

    /**
     * ## Parse a JSON Schema
     * @param schema - The JSON Schema to parse
     * @param id - The ID to assign to the schema
     * @param filterRequired - A function to filter required properties
     * @returns The parsed JSON Schema
     *
     * @notes
     * - It is for internal use only, don't use it outside of this package.
     */
    private parseSchema(
        schema: JSONSchema,
        id: string,
        filterRequired?: (required: string[]) => string[],
    ): JSONSchema {
        // We are intentionally removing $id and $schema from the schema object
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { $id, $schema, ...rest } = schema;
        return { $id: id, ...this.parseRef(rest, id, filterRequired) };
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
