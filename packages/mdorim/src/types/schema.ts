import { Options as JsonSchemaOptions } from "jsonschema";

export type SchemaID = string;

export type ValidateOptions = {
    required?: boolean;
    /**
     * ### Options for the validator
     * These options are passed to the jsonschema validator
     * - `required`: Whether to validate required properties (default: undefined, which means it will use the schema's required properties)
     * - `skipAttributes`: Whether to skip attributes that are not in the schema (default: undefined, which means it will not skip any attributes)
     * - `allowUnknownAttributes`: Whether to allow unknown attributes (default: undefined, which means it will not allow unknown attributes)
     */
    validator?: Pick<
        JsonSchemaOptions,
        "required" | "skipAttributes" | "allowUnknownAttributes"
    >;
};
