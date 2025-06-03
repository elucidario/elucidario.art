import { parseLinkedArtSchema, filterLinkedArtRequired } from "@/utils";
import abstractJson from "./abstract.json" with { type: "json" };

const Abstract = parseLinkedArtSchema(
    abstractJson,
    "/linked-art/entities/Abstract",
    filterLinkedArtRequired,
);

export default Abstract;
