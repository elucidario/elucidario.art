import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { camelCase, startCase } from "lodash-es";

/**
 * Map a file ID/path to a JSON Schema ID
 * @param value - The file ID/path to map
 * @param namespace - The namespace to use for the mapping
 * @returns The mapped file ID
 *
 * @notes
 * - It is for internal use only, don't use it outside of this package.
 */
export function mapFileId(value: string, namespace?: string): string {
    if (!namespace) {
        namespace = "";
    }
    namespace = namespace.startsWith("/") ? namespace : `/${namespace}`;
    if (value.startsWith("#")) {
        return `${namespace}${value}`;
    }
    if (value.includes(".json")) {
        const primaryNamespace = namespace.split("/")[1];
        const [file, hash] = value.replace(".json", "").split("#");
        return `/${primaryNamespace}/${startCase(camelCase(file)).replace(" ", "")}#${hash}`;
    }
    return value;
}

/**
 * Parse a JSON Schema reference
 * @param schema - The JSON Schema to parse
 * @param base - The base URL to use for resolving references
 * @param filterRequired - A function to filter required properties
 * @returns The parsed JSON Schema
 *
 * @notes
 * - It is for internal use only, don't use it outside of this package.
 */
export function parseRef(
    schema: JSONSchema,
    base: string,
    filterRequired?: (required: string[]) => string[],
): JSONSchema {
    return Object.entries(schema).reduce((acc, [key, value]) => {
        if (key === "$ref") {
            acc[key as keyof JSONSchema] = mapFileId(value, base);
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

/**
 * Parse a JSON Schema
 * @param schema - The JSON Schema to parse
 * @param id - The ID to assign to the schema
 * @param filterRequired - A function to filter required properties
 * @returns The parsed JSON Schema
 *
 * @notes
 * - It is for internal use only, don't use it outside of this package.
 */
export function parseSchema(
    schema: JSONSchema,
    id: string,
    filterRequired?: (required: string[]) => string[],
): JSONSchema {
    // We are intentionally removing $id and $schema from the schema object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $id, $schema, ...rest } = schema;
    return { $id: id, ...parseRef(rest, id, filterRequired) };
}
