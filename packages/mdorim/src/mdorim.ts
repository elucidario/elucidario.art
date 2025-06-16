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

import { filterLinkedArtRequired, isMdorimError, parseSchema } from "@/utils";
import { MdorimError } from "@/errors";
import { I18n } from "@/translations";

import Schemas from "@/schemas";
import { SchemaID } from "@/types";


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

    /**
     * ## Mdorim constructor
     *
     * Initializes the Mdorim class with core and linked art schemas.
     * It also sets up the i18n instance for translations.
     *
     * @param defaultLocale - The default locale to use for translations (optional).
     */
    constructor(private i18n: I18n, ajvOptions?: Options) {
        this.parser = new $RefParser();
        this.validator = new Ajv({ allErrors: false, strict: false, ...ajvOptions });
        addFormats(this.validator);

        for (const [key, value] of Object.entries(Schemas.Core)) {
            if (typeof value === "object" && value !== null) {
                const id = `/core/${key}`;
                this.validator.addSchema(
                    parseSchema(value as JSONSchema, id, filterLinkedArtRequired),
                );
            }
        }

        for (const [key, value] of Object.entries(Schemas.LinkedArt)) {
            if (typeof value === "object" && value !== null) {
                const id = `/linked-art/${key}`;
                this.validator.addSchema(
                    parseSchema(value as JSONSchema, id, filterLinkedArtRequired),
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

    public getValidator(id: SchemaID): AnyValidateFunction {
        const schema = this.validator.getSchema(id);
        if (!schema) {
            throw this.error(`Validator ${id} not found`);
        }
        return schema;
    }

    public async validate(
        id: SchemaID,
        value: unknown,
    ): Promise<boolean> {
        const validator = this.getValidator(id);
        const valid = await validator(value);

        if (!valid) {
            const errors = validator.errors || [];
            localize[this.i18n.locale](validator.errors); // Localize errors to the current locale

            throw this.error("Validation failed", {
                id,
                errors: errors.reduce((acc, error) => {
                    const key = error.instancePath.slice(1) || id;
                    acc[key] = error.message ?? "";
                    return acc;
                }, {} as Record<string, string>),
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

    pathToId(path: string): SchemaID {
        path = path.split("#")[0]; // Remove fragment identifier if present
        if (!path.includes("mdorim") && path.includes("json")) {
            const parts = path.replace(".json", "").slice(1).split("/");
            const [namespace, name] = parts.splice(parts.length - 2, 2);

            return `/${namespace}/${startCase(camelCase(name)).replace(" ", "")}`;
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

            return `/${namespace}/${startCase(camelCase(name)).replace(" ", "")}`;
        }
        return path as SchemaID;
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
