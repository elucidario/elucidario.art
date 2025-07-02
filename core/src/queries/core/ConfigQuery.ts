import { Cypher } from "@/db";
import { AbstractQuery } from "../AbstractQuery";
import { Hooks, PropertyConstraint } from "@/types";
import { Config, ConfigTypes } from "@elucidario/mdorim";

export class ConfigQuery extends AbstractQuery<Config<ConfigTypes>> {
    constraints: PropertyConstraint[] = [
        {
            name: "config_unique_uuid",
            labels: ["Config"],
            prop: "uuid",
        },
    ];

    constructor(cypher: Cypher, hooks: Hooks) {
        super(cypher, hooks);
    }
}
