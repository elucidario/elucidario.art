import { MdorimBase } from "../mdorim";
import { LinkedArtEntity, LinkedArtProperties } from "./core";

export interface Set
    extends MdorimBase<
        LinkedArtEntity<
            Pick<
                LinkedArtProperties,
                | "dimension"
                | "about"
                | "members_exemplified_by"
                | "members_contained_by"
                | "created_by"
                | "used_for"
            >
        >,
        "Set"
    > {}
