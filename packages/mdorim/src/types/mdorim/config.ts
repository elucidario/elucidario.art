import { MdorimBase } from "./definitions";
import { User } from "./user";

export type ConfigTypes = "MainConfig";

export type Config<ConfigType extends ConfigTypes> = MdorimBase<
    {
        sysadmins: User[];
    },
    ConfigType
>;
