import { MdorimBase } from "../mdorim";
import { LinkedArtEntity, LinkedArtProperties } from "./core";

export interface Place
    extends MdorimBase<
        LinkedArtEntity<Pick<LinkedArtProperties, "part_of" | "defined_by">>,
        "Place"
    > {}
