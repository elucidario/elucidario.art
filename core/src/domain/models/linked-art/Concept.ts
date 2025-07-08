import { Concept as ConceptType } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";
import { PropertyConstraint } from "@/types";

/**
 * # Concept
 *
 * @link https://linked.art/api/1.0/endpoint/concept/
 */
export class Concept
    extends AModel<ConceptType>
    implements IModel<ConceptType>
{
    /**
     * ## Concept.constraints
     * This property holds an array of Cypher constraints that should be applied to the model.
     * These constraints are used to ensure data integrity and uniqueness in the database.
     */
    constraints: PropertyConstraint[] = [];

    constructor(data?: ConceptType) {
        super("/linked-art/Concept", data);
    }
}
