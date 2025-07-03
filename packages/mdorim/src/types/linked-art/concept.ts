import { MdorimBase } from "@/types/mdorim/";
import { LinkedArtEntity, LinkedArtProperties } from "./core";
import { TypesOfType } from "./shared";

export type ConceptReference = MdorimBase<Record<string, unknown>, "Reference">;

export type Concept<T extends TypesOfType = TypesOfType> = MdorimBase<
    LinkedArtEntity<Pick<LinkedArtProperties, "broader" | "created_by">>,
    T
>;
