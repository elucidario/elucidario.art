import { ValidationError, Validator as JsonSchema } from "jsonschema";

import { Schema, SchemaID, SchemaPath } from "@/validator/schema/types";
import { isMdorimError, mdorimStringToDate, parseObjectPath } from "@/utils";
import { MdorimError } from "@/errors";
import { DefaultLocale, Locales } from "@/types";
import { Entities } from "@/types/domain/entities/entities";
import { I18n } from "@/translations";

/**
 * # Validator
 *
 * This class is responsible for managing schemas and validating entities against them.
 * It uses the jsonschema library for validation.
 *
 * @example
 * const validator = new Validator("/core/User");
 * const user = {
 *    name: "John Doe",
 *    email: "john@example.com",
 * };
 * const isValid = validator.validate(user);
 */
export class Validator {
    private validator: JsonSchema;

    private i18n: I18n;

    private cache: Map<string, Schema>;

    /**
     * ## Validator constructor
     */
    constructor(
        private path: SchemaPath,
        private defaultLocale: Locales = DefaultLocale,
    ) {
        this.cache = new Map();
        this.validator = new JsonSchema();
        this.i18n = new I18n(this.defaultLocale);
    }

    /**
     * ## Get schema path
     *
     * This method returns the schema path.
     *
     * @returns SchemaPath - The schema path
     */
    get schemaPath(): SchemaPath {
        return this.path;
    }

    /**
     * ## Import schema by path
     *
     * This method imports the schema from the given path and caches it.
     *
     * @param path - Path to the schema
     * @returns Schema object
     */
    private async importSchema(path: SchemaPath): Promise<Schema> {
        if (this.cache.has(path)) {
            return Promise.resolve(this.cache.get(path)!);
        }

        try {
            const schema = await import(`./schema/${path}`);
            this.cache.set(path, schema.default);
            return Promise.resolve(schema.default);
        } catch (error) {
            if (isMdorimError(error)) {
                throw error;
            }
            throw this.error(`Schema ${path} not found`);
        }
    }

    /**
     * ## Get schema by path
     *
     * @param path - Path to the schema
     * @returns Schema object
     */
    private async schema(path: SchemaPath): Promise<Schema> {
        try {
            if (path.startsWith("/")) {
                // remove the leading /
                path = path.substring(1);
            }
            if (path.includes("#")) {
                const [schemaPath, rest] = path.split("#");
                const schema = await this.importSchema(schemaPath);
                if (rest) {
                    return (rest.split("/") as Array<keyof Schema>).reduce(
                        (acc, cur) => {
                            if (acc[cur]) {
                                return acc[cur];
                            }
                            return acc;
                        },
                        schema,
                    );
                } else {
                    return schema;
                }
            } else {
                return await this.importSchema(path);
            }
        } catch (error) {
            if (isMdorimError(error)) {
                throw error;
            }
            throw this.error(`Schema ${path} not found`);
        }
    }

    /**
     * ## Initialize schemas
     */
    private async initSchemas(schema: Schema) {
        try {
            this.validator.addSchema(schema, schema.id);

            if (this.validator.unresolvedRefs.length > 0) {
                const loop = async () => {
                    const nextSchema = this.validator.unresolvedRefs.shift();
                    if (nextSchema) {
                        const schema = await this.schema(nextSchema);
                        if (isMdorimError(schema)) {
                            throw schema;
                        }
                        this.validator.addSchema(schema, nextSchema);
                        await loop();
                    }
                };
                await loop();
            }
        } catch (error) {
            if (isMdorimError(error)) {
                throw error;
            }
            throw this.error(`Schema ${schema.id} not found`);
        }
    }

    /**
     * ## Get schema by ID
     *
     * @param schemaId - Schema ID to get
     * @returns - Schema object
     */
    public async getSchema(
        schemaId: SchemaID,
        translate: boolean = true,
    ): Promise<Schema> {
        try {
            const schema = await this.schema(schemaId);
            const deref = (await this.dereference(schema)) as Schema;
            if (!translate) {
                return deref;
            }
            return this.i18n.translateSchema(deref);
        } catch (error) {
            if (isMdorimError(error)) {
                throw error;
            }
            throw this.error(`Schema ${schemaId} not found`);
        }
    }

    /**
     * ## Dereference schema
     *
     * This method dereferences the schema by replacing $ref with the actual schema.
     * It recursively traverses the schema and replaces all $ref with the actual schema.
     * It also handles nested schemas and properties.
     *
     * @param schema - Schema to dereference
     * @param parent - Parent key for the schema
     * @returns - Dereferenced schema
     */
    public async dereference(schema: Schema, parent?: string) {
        return await Object.entries(schema).reduce(
            async (asyncAcc, [key, value]) => {
                const acc = await asyncAcc;
                if (key === "$ref") {
                    const derefSchema = await this.schema(value as SchemaPath);
                    acc[parent!] = await this.dereference(derefSchema, parent);
                } else if (["properties", "items"].includes(key)) {
                    acc[key] = await this.dereference(value as Schema, parent);
                } else if (typeof value === "object" && !Array.isArray(value)) {
                    const nestedDeref = await this.dereference(
                        value as Schema,
                        key,
                    );
                    acc[key] = nestedDeref[key];
                } else if (Array.isArray(value)) {
                    acc[key] = await Promise.all(
                        value.map(async (item) => {
                            if (typeof item === "object") {
                                const derefItem = await this.dereference(
                                    item as Schema,
                                    key,
                                );
                                return derefItem[key];
                            }
                            return item;
                        }),
                    );
                } else {
                    acc[key] = value;
                }

                return acc;
            },
            Promise.resolve({} as Record<string, unknown>),
        );
    }

    /**
     * ## Validate value against schema
     *
     * @param value - Value to validate
     * @returns - Promise<boolean | MdorimError> - True if valid, MdorimError if invalid
     */
    public async validate<T extends Entities[keyof Entities]>(
        value: unknown,
    ): Promise<T | MdorimError> {
        try {
            const schema = await this.schema(this.schemaPath);
            await this.initSchemas(schema);
            const result = this.validator.validate(value, schema, {
                rewrite: (instance, schema) => {
                    if (
                        instance &&
                        schema.format &&
                        schema.format === "date-time"
                    ) {
                        return mdorimStringToDate(instance);
                    }
                    return instance;
                },
            });
            if (result.valid) {
                return result.instance as T;
            }
            return this.error(
                `Validation failed for ${schema.id}`,
                result.errors,
            );
        } catch (error) {
            if (isMdorimError(error)) {
                return error;
            }
            return this.error(`Validation failed for ${this.schemaPath}`);
        }
    }

    /**
     * ## Create a MdorimError instance from ValidationError[]
     *
     * @param message - Error message
     * @param errors - Validation errors
     * @returns - MdorimError - MdorimError instance
     */
    private error(message: string, errors?: ValidationError[]): MdorimError {
        return new MdorimError(
            message,
            errors?.reduce(
                (acc, cur) => {
                    let path;

                    if (cur.property.includes("instance.")) {
                        path = cur.property.replace("instance.", "");
                    } else if (typeof cur.schema === "string") {
                        path = cur.schema.split("/").pop();
                    } else {
                        path = cur.argument;
                    }

                    if (!path) {
                        return acc;
                    }

                    const err = parseObjectPath(path, cur.message);

                    if (!err.hasOwnProperty(path)) {
                        // edge case where the error occurred at the first item of
                        // the array, them we need to return the error as is, as the
                        // parseObjectPath already return the correct object
                        return err as Record<string, unknown>;
                    }

                    acc[path] = (err as Record<string, unknown>)[path];

                    return acc;
                },
                {} as Record<string, unknown>,
            ),
        );
    }
}
