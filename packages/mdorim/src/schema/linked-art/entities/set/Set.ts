import { parseLinkedArtSchema, filterLinkedArtRequired } from "@/utils";
import setJson from "./set.json" with { type: "json" };

const Set = parseLinkedArtSchema(
    setJson,
    "/linked-art/entities/Set",
    filterLinkedArtRequired,
);

export default Set;
