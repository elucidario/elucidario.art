import { parseLinkedArtSchema, filterLinkedArtRequired } from "@/utils";
import objectJson from "./object.json" with { type: "json" };

const PhysicalObject = parseLinkedArtSchema(
    objectJson,
    "/linked-art/entities/PhysicalObject",
    filterLinkedArtRequired,
);

export default PhysicalObject;
