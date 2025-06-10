import { MdorimBase } from "../mdorim";
import { LinkedArtEntity, LinkedArtProperties } from "./core";

export interface Visual
    extends MdorimBase<
        LinkedArtEntity<
            Pick<
                LinkedArtProperties,
                | "dimension"
                | "part_of"
                | "conceptually_part_of"
                | "about"
                | "represents"
                | "represents_instance_of_type"
                | "subject_to"
                | "created_by"
                | "used_for"
            >
        >,
        "VisualItem"
    > {}
