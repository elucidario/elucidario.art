import { LinkedArtEntity, LinkedArtProperties, LinkedArtSharedStructure } from "./core";

export type DigitalObject =
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
        >,
        "DigitalObject"
    >


export type DigitalService =
    Omit<
        LinkedArtSharedStructure<
            Pick<LinkedArtProperties, "access_point" | "conforms_to">,
            "DigitalService"
        >,
        | "equivalent"
        | "representation"
        | "member_of"
        | "subject_of"
        | "attributed_by"
    >;
