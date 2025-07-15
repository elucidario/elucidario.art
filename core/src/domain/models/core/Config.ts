import { Config as ConfigType, ConfigTypes } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";
import { AuthContext, Hooks, PropertyConstraint } from "@/types";
import { MongoAbility, RawRuleOf } from "@casl/ability";

/**
 * # Config
 * The Config class provides methods to validate the Config Entities.
 */
export class Config
    extends AModel<ConfigType<ConfigTypes>>
    implements IModel<ConfigType<ConfigTypes>> {
    /**
     * ## Config.constraints
     * This property holds an array of Cypher constraints that should be applied to the model.
     * These constraints are used to ensure data integrity and uniqueness in the database.
     */
    constraints: PropertyConstraint[] = [
        {
            name: "config_unique_uuid",
            labels: ["Config"],
            prop: "uuid",
        },
    ];

    /**
     * Creates a new instance of Config.
     * @param data - Optional initial data for the membership.
     */
    constructor(
        data?: ConfigType<ConfigTypes> | null,
        protected hooks?: Hooks,
    ) {
        super("/core/Config", data, hooks);
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
        context: AuthContext,
    ): RawRuleOf<MongoAbility>[] {
        const { role } = context;

        if (role === "sysadmin") {
            abilities.push({
                action: "manage",
                subject: "Config",
            });
        }

        return abilities;
    }
}
