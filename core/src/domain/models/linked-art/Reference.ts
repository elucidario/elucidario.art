import { GenericType, Reference as ReferenceType } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";
import { PropertyConstraint } from "@/types";

/**
 * # ReferenceModel
 *
 * @link https://linked.art/api/1.0/shared/reference/
 */
export class Reference
    extends AModel<ReferenceType<GenericType>>
    implements IModel<ReferenceType<GenericType>>
{
    /**
     * ## Reference.constraints
     * This property holds an array of Cypher constraints that should be applied to the model.
     * These constraints are used to ensure data integrity and uniqueness in the database.
     */
    constraints: PropertyConstraint[] = [
        {
            name: "reference_unique_uuid",
            labels: ["Reference"],
            prop: "uuid",
        },
    ];

    constructor(data?: ReferenceType<GenericType>) {
        super("/linked-art/Core#/$defs/AnyRef", data);
    }
}
