import { ValidationError, Validator } from "jsonschema";
import { Schema } from "./types";
import * as Schemas from "@/schemas";

export type SchemaID = Schema["id"];

export class MdorimError extends Error {
    public errors: Record<string, string>;
    constructor(message: string, errors: Record<string, string> = {}) {
        super(message);
        this.name = "MdorimError";
        this.errors = errors;
    }
    getErrors(): Record<string, string> {
        return this.errors;
    }
    addError(field: string, message: string): MdorimError {
        this.errors[field] = message;
        return this;
    }
}

export default class Mdorim {
    schemas: Map<SchemaID, Schema>;
    private validator: Validator;

    constructor() {
        this.validator = new Validator();
        this.schemas = new Map<SchemaID, Schema>();
        this.initSchemas();
    }

    public initSchemas() {
        for (const schema of Object.values(Schemas)) {
            if (schema.id) {
                this.schemas.set(schema.id, schema);
                // Add schema to validator
                this.validator.addSchema(schema, schema.id);
            }
        }
    }

    public getValidator(): Validator {
        return this.validator;
    }

    public validate(
        schema: Schema,
        value: unknown,
    ): boolean | ValidationError[] {
        const result = this.validator.validate(value, schema);
        if (result.valid) {
            return result.valid;
        }
        return result.errors;
    }

    public validateEntity(
        schemaId: SchemaID,
        entity: unknown,
        throwOnError = true,
    ): true | MdorimError {
        if (!this.schemas.has(schemaId)) {
            this.error(`Schema ${schemaId} not found`);
        }
        const schema = this.schemas.get(schemaId) as Schema;
        const result = this.validator.validate(entity, schema);

        if (result.errors.length > 0) {
            if (throwOnError) {
                this.error(`Validation failed for ${schemaId}`, result.errors);
            }
        }

        if (result.valid) {
            return true;
        }

        return this.error(`Validation failed for ${schemaId}`, result.errors);
    }

    private error(message: string, errors?: ValidationError[]): MdorimError {
        return new MdorimError(
            message,
            errors?.reduce(
                (acc, cur) => {
                    const path = cur.property.replace("instance.", "");
                    acc[path] = cur.message;
                    return acc;
                },
                {} as Record<string, string>,
            ),
        );
    }
}
