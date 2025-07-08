import { History as HistoryType } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";
import { PropertyConstraint } from "@/types";

/**
 * # History
 * The History class provides methods to validate the History.
 */
export class History
    extends AModel<HistoryType>
    implements IModel<HistoryType>
{
    /**
     * ## History.constraints
     * This property holds an array of Cypher constraints that should be applied to the model.
     * These constraints are used to ensure data integrity and uniqueness in the database.
     */
    constraints: PropertyConstraint[] = [
        {
            name: "history_unique_uuid",
            labels: ["History"],
            prop: "uuid",
        },
    ];

    /**
     * Creates a new instance of History.
     * @param data - Optional initial data for the history.
     */
    constructor(data?: HistoryType) {
        super("/core/History", data);
    }
}
