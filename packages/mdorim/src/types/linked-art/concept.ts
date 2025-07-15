import { LinkedArtEntity, LinkedArtProperties } from "./core";
import { TypesOfType } from "./shared";

export type Concept<T extends TypesOfType = TypesOfType> = LinkedArtEntity<
    Pick<LinkedArtProperties, "broader" | "created_by">,
    T
>;
