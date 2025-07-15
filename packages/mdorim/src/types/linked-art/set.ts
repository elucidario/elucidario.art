import { LinkedArtEntity, LinkedArtProperties } from "./core";

export type Set = LinkedArtEntity<
    Pick<
        LinkedArtProperties,
        | "dimension"
        | "about"
        | "members_exemplified_by"
        | "members_contained_by"
        | "created_by"
        | "used_for"
    >,
    "Set"
>;
