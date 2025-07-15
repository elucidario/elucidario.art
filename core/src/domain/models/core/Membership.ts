import { TeamMemberOrInvitedMember } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";
import { AuthContext, Hooks, PropertyConstraint } from "@/types";
import { MongoAbility, RawRuleOf } from "@casl/ability";

/**
 * # Membership
 * The Membership class provides methods to validate the Membership Entities.
 */
export class Membership
    extends AModel<TeamMemberOrInvitedMember>
    implements IModel<TeamMemberOrInvitedMember> {
    /**
     * ## Membership.constraints
     * This property holds an array of Cypher constraints that should be applied to the model.
     * These constraints are used to ensure data integrity and uniqueness in the database.
     */
    constraints: PropertyConstraint[] = [
        {
            name: "member_unique_uuid",
            labels: ["Member"],
            prop: "uuid",
        },
        {
            name: "member_unique_email",
            labels: ["Member"],
            prop: "email",
        },
    ];

    /**
     * Creates a new instance of Membership.
     * @param data - Optional initial data for the membership.
     */
    constructor(
        data?: TeamMemberOrInvitedMember | null,
        protected hooks?: Hooks,
    ) {
        super(["/core/InvitedMember", "/core/TeamMember"], data, hooks);
    }

    setAbilities(
        abilities: RawRuleOf<MongoAbility>[],
        context: AuthContext,
    ): RawRuleOf<MongoAbility>[] {
        console.log({ abilities, context });

        return abilities;
    }
}
