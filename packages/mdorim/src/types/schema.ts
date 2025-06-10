import { Schema as PrimitiveSchema } from "jsonschema";

export { PrimitiveSchema };

export type SchemaID = string;

export type SchemaType = Omit<PrimitiveSchema, "id"> & {
    $id: SchemaID;
};

export type GetSchemaOptions = {
    /**
     * ### Whether to translate schema properties
     */
    translate?: boolean;
    /**
     * ### Whether to dereference schema properties
     * Dereferencing means resolving references to other schemas
     */
    deref?: boolean;
    /**
     * ### Whether the schema required is validated
     *
     * If true, the schema will have its required properties validated - default is true.
     *
     * If false, the schema will not have its required properties validated, this should be explicitly set.
     *
     * This is useful for optional schemas or when you want to validate only certain properties.
     */
    required?: boolean;
};
