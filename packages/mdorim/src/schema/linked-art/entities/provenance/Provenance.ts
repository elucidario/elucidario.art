import { parseLinkedArtSchema, filterLinkedArtRequired } from "@/utils";
import provenanceJson from "./provenance.json" with { type: "json" };

const Provenance = parseLinkedArtSchema(
    provenanceJson,
    "/linked-art/entities/Provenance",
    filterLinkedArtRequired,
);

export default Provenance;
