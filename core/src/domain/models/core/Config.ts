import { Config as ConfigType, ConfigTypes } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";
import { PropertyConstraint } from "@/types";

/**
 * # Config
 * The Config class provides methods to validate the Config Entities.
 */
export class Config
    extends AModel<ConfigType<ConfigTypes>>
    implements IModel<ConfigType<ConfigTypes>>
{
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
    constructor(data?: ConfigType<ConfigTypes>) {
        super("/core/Config", data);
    }
}
