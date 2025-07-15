import { History as HistoryType } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";
import { AuthContext, Hooks, PropertyConstraint } from "@/types";
import { MongoAbility, RawRuleOf } from "@casl/ability";

/**
 * # History
 * The History class provides methods to validate the History.
 */
export class History
    extends AModel<HistoryType>
    implements IModel<HistoryType> {
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
    constructor(
        data?: HistoryType | null,
        protected hooks?: Hooks,
    ) {
        super("/core/History", data, hooks);
    }

    /**
     * ## Sets the abilities for the user based on their role.
     * This method modifies the abilities array to include management permissions.
     *
     * @param abilities - The current abilities array.
     * @param context - The authentication context containing user and role information.
     * @returns The modified abilities array.
     */
    protected setAbilities(
        abilities: RawRuleOf<MongoAbility>[],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _context: AuthContext,
    ): RawRuleOf<MongoAbility>[] {
        // const { role } = context;

        abilities.push({
            action: "read",
            subject: "History",
        });

        return abilities;
    }
}
