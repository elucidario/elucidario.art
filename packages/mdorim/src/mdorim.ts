import { ValidationError, Validator } from "jsonschema";
import { Schema, SchemaID, PrimitiveSchema } from "./types";
import * as Schemas from "./schemas";
import { parseObjectPath } from "./utils";
import { MdorimError } from "./mdorim.error";

/**
 * Mdorim class
 * This class is responsible for managing schemas and validating entities against them.
 * It uses the jsonschema library for validation.
 * @class
 * @example
 * const mdorim = new Mdorim();
 * const userSchema = mdorim.schemas.get("/core/User");
 * const user = {
 *    name: "John Doe",
 *    email: "john@example.com",
 * };
 * const isValid = mdorim.validate(userSchema, user);
 * // or
 * const isValid = mdorim.validateEntity("/core/User", user);
 */
export class Mdorim {
    schemas: Map<SchemaID, Schema>;
    private validator: Validator;

    /**
     * Mdorim constructor
     */
    constructor() {
        this.validator = new Validator();
        this.schemas = new Map<SchemaID, Schema>();
        this.initSchemas();
    }

    /**
     * Initialize schemas
     */
    public initSchemas() {
        for (const schema of Object.values(Schemas)) {
            if (schema.id) {
                this.schemas.set(schema.id, schema);
                // Add schema to validator
                this.validator.addSchema(schema, schema.id);
            }
        }
    }

    /**
     * Get validator instance
     * @returns {Validator} - Validator instance
     */
    public getValidator(): Validator {
        return this.validator;
    }

    /**
     *
     * @param schema - PrimitiveSchema to validate against
     * @param value - Value to validate
     * @returns - boolean | MdorimError - True if valid, MdorimError if invalid
     */
    public validate(
        schema: PrimitiveSchema,
        value: unknown,
    ): boolean | MdorimError {
        const result = this.validator.validate(value, schema);
        if (result.valid) {
            return result.valid;
        }
        return this.error(`Validation failed for ${schema.id}`, result.errors);
    }

    /**
     * Validate entity against schema
     * @param schemaId - Schema ID to validate against
     * @param entity - Entity to validate
     * @returns - true if valid, MdorimError if invalid
     */
    public validateEntity(
        schemaId: SchemaID,
        entity: unknown,
    ): true | MdorimError {
        if (!this.schemas.has(schemaId)) {
            return this.error(`Schema ${schemaId} not found`);
        }
        const schema = this.schemas.get(schemaId) as Schema;
        const result = this.validator.validate(entity, schema);

        if (result.errors.length > 0) {
            return this.error(
                `Validation failed for ${schemaId}`,
                result.errors,
            );
        }

        if (result.valid) {
            return true;
        }

        return this.error(`Validation failed for ${schemaId}`, result.errors);
    }

    /**
     * Create a MdorimError instance from ValidationError[]
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
