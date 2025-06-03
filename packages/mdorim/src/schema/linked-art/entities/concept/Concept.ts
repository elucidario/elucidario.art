import { parseLinkedArtSchema, filterLinkedArtRequired } from "@/utils";
import conceptJson from "./concept.json" with { type: "json" };

const Concept = parseLinkedArtSchema(
    conceptJson,
    "/linked-art/entities/Concept",
    filterLinkedArtRequired,
);

export default Concept;
