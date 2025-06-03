import { Schema as PrimitiveSchema } from "jsonschema";

export { PrimitiveSchema };

export type SchemaID = string;

export type SchemaType = Omit<PrimitiveSchema, "id"> & {
    id: SchemaID;
};

export type SchemaPath = string;
