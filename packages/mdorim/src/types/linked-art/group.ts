import { MdorimBase } from "../mdorim";
import { LinkedArtEntity, LinkedArtProperties } from "./core";

export interface Group
    extends MdorimBase<
        LinkedArtEntity<
            Pick<
                LinkedArtProperties,
                | "contact_point"
                | "residence"
                | "carried_out"
                | "participated_in"
                | "formed_by"
                | "dissolved_by"
            >
        >,
        "Group"
    > {}
