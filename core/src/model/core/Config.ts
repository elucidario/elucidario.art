import { Mdorim, Config as ConfigType, ConfigTypes } from "@elucidario/mdorim";

import AbstractModel from "@/model/AbstractModel";
import InterfaceModel from "@/model/InterfaceModel";

/**
 * # Config
 * The Config class provides methods to validate the Config Entities.
 */
export class Config
    extends AbstractModel<ConfigType<ConfigTypes>>
    implements InterfaceModel<ConfigType<ConfigTypes>>
{
    /**
     * Creates a new instance of Config.
     * @param mdorim - The mdorim instance to use for validation.
     * @param data - Optional initial data for the membership.
     */
    constructor(mdorim: Mdorim, data?: ConfigType<ConfigTypes> | null) {
        super("/core/Config", mdorim, data);
    }
}
