import { MdorimBase } from "../mdorim";
import { LinkedArtEntity, LinkedArtProperties } from "./core";

export type Place = MdorimBase<
    LinkedArtEntity<Pick<LinkedArtProperties, "part_of" | "defined_by">>,
    "Place"
>;
