import { parseLinkedArtSchema, filterLinkedArtRequired } from "@/utils";
import imageJson from "./image.json" with { type: "json" };

const Image = parseLinkedArtSchema(
    imageJson,
    "/linked-art/entities/Image",
    filterLinkedArtRequired,
);

export default Image;
