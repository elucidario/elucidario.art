import { LinkedArtEntity, LinkedArtProperties } from "./core";

export type Person = LinkedArtEntity<
    Pick<
        LinkedArtProperties,
        | "contact_point"
        | "residence"
        | "carried_out"
        | "participated_in"
        | "born"
        | "died"
    >,
    "Person"
>;
