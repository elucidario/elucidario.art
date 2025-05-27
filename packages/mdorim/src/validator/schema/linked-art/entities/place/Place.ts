import { parseLinkedArtSchema, filterLinkedArtRequired } from "@/utils";
import placeJson from "./place.json" with { type: "json" };

const Place = parseLinkedArtSchema(
    placeJson,
    "/linked-art/entities/Place",
    filterLinkedArtRequired,
);

export default Place;
