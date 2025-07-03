import { Email } from "../generic";
import { MdorimBase } from "./definitions";
import { User } from "./user";

export type TeamMemberRole =
    | "admin"
    | "editor"
    | "assistant"
    | "researcher"
    | "anonymous";

export type TeamMember = MdorimBase<
    {
        user: Partial<User> | null; // User is null if the TeamMember is `inactive`
        status: "active" | "suspended" | "inactive";
        email: Email;
        role: TeamMemberRole;
    },
    "TeamMember"
>;

export type InvitedMember = MdorimBase<
    {
        user: User | null; // User may be null if the user has not yet been created
        email: Email;
        role: TeamMemberRole;
    },
    "InvitedMember"
>;

export type TeamMemberOrInvitedMember = TeamMember | InvitedMember;

export type Team = Array<TeamMemberOrInvitedMember>;
