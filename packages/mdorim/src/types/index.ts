import { Schema as PrimitiveSchema } from "jsonschema";

export { PrimitiveSchema };

export type Schema = Omit<PrimitiveSchema, "id"> & {
    id: string;
};

export type SchemaID = Schema["id"];

export type Entity<T> = {
    created_at: string;
    updated_at: string;
} & T;
