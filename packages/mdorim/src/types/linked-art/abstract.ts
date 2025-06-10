import { MdorimBase } from "../mdorim";
import { LinkedArtEntity, LinkedArtProperties } from "./core";

export interface Abstract
    extends MdorimBase<
        LinkedArtEntity<
            Pick<
                LinkedArtProperties,
                | "dimension"
                | "conceptually_part_of"
                | "about"
                | "subject_of"
                | "created_by"
            >
        >,
        "PropositionalObject"
    > { }
