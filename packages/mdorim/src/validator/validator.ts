import { ValidationError, Validator as JsonSchema } from "jsonschema";

import { SchemaType, SchemaID, GetSchemaOptions } from "@/types";
import { isMdorimError, mdorimStringToDate, parseObjectPath } from "@/utils";
import { MdorimError } from "@/errors";
import { Schema } from "@/schema";

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
    schema: Schema;
    private validator: JsonSchema;

    /**
     * ## Validator constructor
     */
    constructor(schema: Schema) {
        this.schema = schema;
        this.validator = new JsonSchema();
    }

    /**
     * ## Initialize schemas
     */
    private async initSchemas(schema: SchemaType) {
        try {
            if (this.validator.schemas[schema.$id]) {
                // schema already exists, no need to add it again
                return;
            }

            this.validator.addSchema(schema, schema.$id);

            if (this.validator.unresolvedRefs.length > 0) {
                const loop = async () => {
                    const nextSchema = this.validator.unresolvedRefs.shift();
                    if (nextSchema) {
                        const schema = this.schema.getSchema(nextSchema, {
                            translate: true,
                        });

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
            throw this.error(`SchemaType ${schema.$id} not found`);
        }
    }

    /**
     * ## Validate value against schema
     *
     * @param value - Value to validate
     * @returns - Promise<boolean | MdorimError> - True if valid, MdorimError if invalid
     */
    public async validate<T extends SchemaType[keyof SchemaType]>(
        id: SchemaID,
        value: unknown,
        options?: GetSchemaOptions,
    ): Promise<T | MdorimError> {
        try {
            const schema = this.schema.getSchema(id, options);
            await this.initSchemas(schema as SchemaType);

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
                `Validation failed for ${schema.$id}`,
                result.errors,
            );
        } catch (error) {
            if (isMdorimError(error)) {
                return error;
            }
            return this.error(`Schema ${id} not found`);
        }
    }

    /**
     * ## Create a MdorimError instance from ValidationError[]
     *
     * @param message - Error message
     * @param errors - Validation errors
     * @returns - MdorimError - MdorimError instance
     */
    private error(
        message: string,
        errors?: Partial<ValidationError>[] | Record<string, unknown>,
    ): MdorimError {
        let mdorimError;

        if (Array.isArray(errors) && errors.length > 0) {
            // If errors is an ValidationError[], we need to parse it
            mdorimError = errors?.reduce(
                (acc, cur) => {
                    let path;

                    if (cur.property?.includes("instance.")) {
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
            );
        } else {
            // If errors is a Record<string, unknown>, we can use it directly
            mdorimError = (errors as Record<string, unknown>) || {};
        }

        return new MdorimError(message, mdorimError);
    }
}
