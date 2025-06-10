import { MdorimBase } from "../mdorim";
import { LinkedArtEntity, LinkedArtProperties } from "./core";

export interface PhysicalObject
    extends MdorimBase<
        LinkedArtEntity<
            Pick<
                LinkedArtProperties,
                | "part_of"
                | "dimension"
                | "made_of"
                | "current_owner"
                | "current_custodian"
                | "current_permanent_custodian"
                | "current_location"
                | "current_permanent_location"
                | "held_or_supported_by"
                | "carries"
                | "shows"
                | "used_for"
                | "produced_by"
                | "destroyed_by"
                | "removed_by"
                | "modified_by"
                | "encountered_by"
                | "changed_ownership_through"
            >
        >,
        "PhysicalObject"
    > {}
