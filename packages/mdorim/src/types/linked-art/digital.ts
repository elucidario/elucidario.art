import { MdorimBase } from "../mdorim";
import { LinkedArtEntity, LinkedArtProperties } from "./core";

export interface DigitalObject
    extends MdorimBase<
        LinkedArtEntity<
            Pick<
                LinkedArtProperties,
                | "dimension"
                | "part_of"
                | "format"
                | "conforms_to"
                | "digitally_carries"
                | "digitally_shows"
                | "digitally_available_via"
                | "access_point"
                | "created_by"
                | "used_for"
            >
        >,
        "DigitalObject"
    > {}

export interface DigitalService
    extends MdorimBase<
        Omit<
            LinkedArtEntity<
                Pick<LinkedArtProperties, "access_point" | "conforms_to">
            >,
            | "equivalent"
            | "representation"
            | "member_iof"
            | "subject_of"
            | "attributed_by"
        >,
        "DigitalService"
    > {}
