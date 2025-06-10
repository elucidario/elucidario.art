import { MdorimBase } from "../mdorim";
import { LinkedArtEntity, LinkedArtProperties } from "./core";

export interface Textual
    extends MdorimBase<
        LinkedArtEntity<
            Pick<
                LinkedArtProperties,
                | "language"
                | "dimension"
                | "part_of"
                | "conceptually_part_of"
                | "content"
                | "format"
                | "about"
                | "subject_to"
                | "created_by"
                | "used_for"
            >
        >,
        "LinguisticObject"
    > {}
