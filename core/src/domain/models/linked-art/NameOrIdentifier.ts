import { IdentifierOrName } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";
import { PropertyConstraint } from "@/types";

export class NameOrIdentifier
    extends AModel<IdentifierOrName>
    implements IModel<IdentifierOrName>
{
    /**
     * ## Concept.constraints
     * This property holds an array of Cypher constraints that should be applied to the model.
     * These constraints are used to ensure data integrity and uniqueness in the database.
     */
    constraints: PropertyConstraint[] = [];

    constructor(data?: IdentifierOrName) {
        super(
            [
                "/linked-art/Core#/$defs/Identifier",
                "/linked-art/Core#/$defs/Name",
            ],
            data,
        );
    }
}
