import { parseLinkedArtSchema, filterLinkedArtRequired } from "@/utils";
import eventJson from "./event.json" with { type: "json" };

const Event = parseLinkedArtSchema(
    eventJson,
    "/linked-art/entities/Event",
    filterLinkedArtRequired,
);

export default Event;
