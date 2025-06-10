import { PrimitiveSchema, SchemaType } from "@/types";

const mapFileId = new Map<string, string>([
    ["core.json", "/linked-art/Core"],
    ["set.json", "/linked-art/Set"],
    ["text.json", "/linked-art/Text"],
    ["event.json", "/linked-art/Event"],
    ["group.json", "/linked-art/Group"],
    ["place.json", "/linked-art/Place"],
    ["image.json", "/linked-art/Image"],
    ["object.json", "/linked-art/Object"],
    ["person.json", "/linked-art/Person"],
    ["digital.json", "/linked-art/Digital"],
    ["concept.json", "/linked-art/Concept"],
    ["abstract.json", "/linked-art/Abstract"],
    ["provenance.json", "/linked-art/Provenance"],
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
                    acc[key as keyof SchemaType] = value.replace(
                        jsonLD,
                        jsonId,
                    );
                } else {
                    acc[key as keyof SchemaType] = value;
                }
            } else {
                acc[key as keyof SchemaType] = value;
            }
        } else if (key === "required") {
            acc[key as keyof SchemaType] = filterRequired
                ? filterRequired(value as string[])
                : value;
        } else if (typeof value === "object" && !Array.isArray(value)) {
            const nestedDeref = parseRef(value as SchemaType, filterRequired);
            acc[key as keyof SchemaType] = nestedDeref;
        } else if (Array.isArray(value)) {
            acc[key as keyof SchemaType] = value.map((item) => {
                if (typeof item === "object") {
                    return parseRef(item as SchemaType, filterRequired);
                }
                return item;
            });
        } else {
            acc[key as keyof SchemaType] = value;
        }

        return acc;
    }, {} as SchemaType);
}

export function parseSchema(
    schema: any,
    id: string,
    filterRequired?: (required: string[]) => string[],
): SchemaType {
    return { $id: id, ...parseRef(schema as SchemaType, filterRequired) };
}
