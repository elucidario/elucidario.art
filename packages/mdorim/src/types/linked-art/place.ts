import { LinkedArtEntity, LinkedArtProperties } from "./core";

export type Place = LinkedArtEntity<
    Pick<LinkedArtProperties, "part_of" | "defined_by">,
    "Place"
>;
