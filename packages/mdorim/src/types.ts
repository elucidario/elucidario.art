import { Schema as PrimitiveSchema } from "jsonschema";

export type Schema = Omit<PrimitiveSchema, "id"> & {
    id: string;
};
