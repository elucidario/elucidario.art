import { parseLinkedArtSchema, filterLinkedArtRequired } from "@/utils";
import personJson from "./person.json" with { type: "json" };

const Person = parseLinkedArtSchema(
    personJson,
    "/linked-art/entities/Person",
    filterLinkedArtRequired,
);

export default Person;
