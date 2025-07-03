import { Mdorim, TeamMemberOrInvitedMember } from "@elucidario/mdorim";

import AbstractModel from "@/model/AbstractModel";
import InterfaceModel from "@/model/InterfaceModel";

/**
 * # Membership
 * The Membership class provides methods to validate the Membership Entities.
 */
export class Membership
    extends AbstractModel<TeamMemberOrInvitedMember>
    implements InterfaceModel<TeamMemberOrInvitedMember>
{
    /**
     * Creates a new instance of Membership.
     * @param mdorim - The mdorim instance to use for validation.
     * @param data - Optional initial data for the membership.
     */
    constructor(mdorim: Mdorim, data?: TeamMemberOrInvitedMember | null) {
        super(["/core/InvitedMember", "/core/TeamMember"], mdorim, data);
    }
}
