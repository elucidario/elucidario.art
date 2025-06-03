import { SchemaID, SchemaPath } from "@/schema/types";

export const mapIdPath = new Map<SchemaID, SchemaPath>([
    ["linked-art/entities/Group", "linked-art/entities/group/Group"],
    ["linked-art/entities/Digital", "linked-art/entities/digital/Digital"],
    ["linked-art/entities/Event", "linked-art/entities/event/Event"],
    ["linked-art/entities/Event", "linked-art/entities/event/Event"],
    ["linked-art/entities/Concept", "linked-art/entities/concept/Concept"],
    [
        "linked-art/entities/PhysicalObject",
        "linked-art/entities/object/PhysicalObject",
    ],
    ["linked-art/entities/Person", "linked-art/entities/person/Person"],
    ["linked-art/entities/Place", "linked-art/entities/place/Place"],
    ["linked-art/entities/Image", "linked-art/entities/image/Image"],
    [
        "linked-art/entities/Provenance",
        "linked-art/entities/provenance/Provenance",
    ],
    ["linked-art/entities/Set", "linked-art/entities/set/Set"],
    ["linked-art/entities/Text", "linked-art/entities/text/Text"],
]);
