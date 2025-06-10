import { MdorimBase } from "@/types/mdorim/";
import { LinkedArtEntity, LinkedArtProperties } from "./core";

export type ConceptReference = MdorimBase<{}, "Reference">;

export interface Concept
    extends MdorimBase<
        LinkedArtEntity<Pick<LinkedArtProperties, "broader" | "created_by">>,
        "Concept"
    > {}
