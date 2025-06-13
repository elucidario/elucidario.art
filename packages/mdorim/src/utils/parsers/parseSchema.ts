import { JSONSchema } from "@apidevtools/json-schema-ref-parser";

function parseRef(
    schema: JSONSchema,
    base: string,
    filterRequired?: (required: string[]) => string[],
): JSONSchema {
    const { $id, ...rest } = schema;
    return Object.entries(rest).reduce((acc, [key, value]) => {
        if (key === "$ref") {
            // where the magic happens
            if (value.includes("#")) {
                const jsonLD = value.split("#")[0];
                if (!jsonLD) {
                    acc[key as keyof JSONSchema] = `${base}${value}`;
                } else {
                    acc[key as keyof JSONSchema] = value;
                }
            } else {
                acc[key as keyof JSONSchema] = value;
            }
        } else if (key === "required") {
            acc[key as keyof JSONSchema] = filterRequired
                ? filterRequired(value as string[])
                : value;
        } else if (typeof value === "object" && !Array.isArray(value)) {
            const nestedDeref = parseRef(value, base, filterRequired);
            acc[key as keyof JSONSchema] = nestedDeref;
        } else if (Array.isArray(value)) {
            acc[key as keyof JSONSchema] = value.map((item) => {
                if (typeof item === "object") {
                    return parseRef(item, base, filterRequired);
                }
                return item;
            });
        } else {
            acc[key as keyof JSONSchema] = value;
        }

        return acc;
    }, {} as JSONSchema);
}

export function parseSchema(
    schema: any,
    id: string,
    filterRequired?: (required: string[]) => string[],
): JSONSchema {
    return { $id: id, ...parseRef(schema, id, filterRequired) };
}
