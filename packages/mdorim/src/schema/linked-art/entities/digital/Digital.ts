import { parseLinkedArtSchema, filterLinkedArtRequired } from "@/utils";
import digitalJson from "./digital.json" with { type: "json" };

const Digital = parseLinkedArtSchema(
    digitalJson,
    "/linked-art/entities/Digital",
    filterLinkedArtRequired,
);

export default Digital;
