import { parseLinkedArtSchema, filterLinkedArtRequired } from "@/utils";
import groupJson from "./group.json" with { type: "json" };

const Group = parseLinkedArtSchema(
    groupJson,
    "/linked-art/entities/Group",
    filterLinkedArtRequired,
);

export default Group;
