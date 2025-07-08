import { Concept as ConceptType } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";

/**
 * # Concept
 *
 * @link https://linked.art/api/1.0/endpoint/concept/
 */
export class Concept
    extends AModel<ConceptType>
    implements IModel<ConceptType>
{
    constructor(data?: ConceptType | null) {
        super("/linked-art/Concept", data);
    }
}
