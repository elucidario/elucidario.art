import { MdorimBase } from "../mdorim";
import { LinkedArtEntity, LinkedArtProperties } from "./core";

export type DigitalObject = MdorimBase<
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
>;

export type DigitalService = MdorimBase<
    Omit<
        LinkedArtEntity<
            Pick<LinkedArtProperties, "access_point" | "conforms_to">
        >,
        | "equivalent"
        | "representation"
        | "member_of"
        | "subject_of"
        | "attributed_by"
    >,
    "DigitalService"
>;
