import { PrimitiveSchema, Schema } from "@/validator";

const mapFileId = new Map<string, string>([
    ["core.json", "/linked-art/Core"],
    ["set.json", "/linked-art/entities/Set"],
    ["text.json", "/linked-art/entities/Text"],
    ["event.json", "/linked-art/entities/Event"],
    ["group.json", "/linked-art/entities/Group"],
    ["place.json", "/linked-art/entities/Place"],
    ["image.json", "/linked-art/entities/Image"],
    ["object.json", "/linked-art/entities/Object"],
    ["person.json", "/linked-art/entities/Person"],
    ["digital.json", "/linked-art/entities/Digital"],
    ["concept.json", "/linked-art/entities/Concept"],
    ["abstract.json", "/linked-art/entities/Abstract"],
    ["provenance.json", "/linked-art/entities/Provenance"],
]);

function parseRef(
    schema: PrimitiveSchema,
    filterRequired?: (required: string[]) => string[],
): PrimitiveSchema {
    const { $id, ...rest } = schema;
    return Object.entries(rest).reduce((acc, [key, value]) => {
        if (key === "$ref") {
            // where the magic happens
            if (value.includes("json")) {
                const jsonLD = value.split("#")[0];
                const jsonId = mapFileId.get(jsonLD);
                if (jsonId) {
                    acc[key as keyof Schema] = value.replace(jsonLD, jsonId);
                } else {
                    acc[key as keyof Schema] = value;
                }
            } else {
                acc[key as keyof Schema] = value;
            }
        } else if (key === "required") {
            acc[key as keyof Schema] = filterRequired
                ? filterRequired(value as string[])
                : value;
        } else if (typeof value === "object" && !Array.isArray(value)) {
            const nestedDeref = parseRef(value as Schema, filterRequired);
            acc[key as keyof Schema] = nestedDeref;
        } else if (Array.isArray(value)) {
            acc[key as keyof Schema] = value.map((item) => {
                if (typeof item === "object") {
                    return parseRef(item as Schema, filterRequired);
                }
                return item;
            });
        } else {
            acc[key as keyof Schema] = value;
        }

        return acc;
    }, {} as Schema);
}

export function parseLinkedArtSchema(
    schema: any,
    id: string,
    filterRequired?: (required: string[]) => string[],
): Schema {
    return { id, ...parseRef(schema as Schema, filterRequired) };
}
