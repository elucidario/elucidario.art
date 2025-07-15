import { LinkedArtEntity, LinkedArtProperties } from "./core";

export type Abstract = LinkedArtEntity<
    Pick<
        LinkedArtProperties,
        | "dimension"
        | "conceptually_part_of"
        | "about"
        | "subject_of"
        | "created_by"
    >,
    "PropositionalObject"
>;
