import { parseLinkedArtSchema, filterLinkedArtRequired } from "@/utils";
import textJson from "./text.json" with { type: "json" };

const Text = parseLinkedArtSchema(
    textJson,
    "/linked-art/entities/Text",
    filterLinkedArtRequired,
);

export default Text;
