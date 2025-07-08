import { MdorimBase, TeamMemberRole } from "@elucidario/mdorim";
import { createMongoAbility, MongoAbility, RawRuleOf } from "@casl/ability";

import { AuthContext, Hooks } from "@/types";

export class Authorization {
    protected hooks: Hooks;

    constructor(hooks: Hooks) {
        this.hooks = hooks;
    }

    permissions<T extends Partial<MdorimBase>>(
        context: AuthContext<T>,
    ): MongoAbility {
        return createMongoAbility(
            this.hooks.filters.apply<
                RawRuleOf<MongoAbility>[],
                [AuthContext<T>]
            >("authorization.rules", [], context),
        );
    }

    getRoles(): TeamMemberRole[] {
        return this.hooks.filters.apply<TeamMemberRole[]>(
            "authorization.roles",
            ["admin", "editor", "assistant", "researcher"],
        );
    }
}
