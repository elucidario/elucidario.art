import { MdorimBase } from "../mdorim";
import { LinkedArtEntity, LinkedArtProperties } from "./core";

export interface Person
    extends MdorimBase<
        LinkedArtEntity<
            Pick<
                LinkedArtProperties,
                | "contact_point"
                | "residence"
                | "carried_out"
                | "participated_in"
                | "born"
                | "died"
            >
        >,
        "Person"
    > {}
