import { MdorimBase } from "./definitions";
import { User } from "./user";

export type TeamMemberRole =
    | "admin"
    | "editor"
    | "assistant"
    | "researcher"
    | "anonymous";

export type TeamMember = MdorimBase<{
    user: User;
    role: TeamMemberRole;
}, "TeamMember">;

export type InvitedMember = MdorimBase<{
    email: string;
    role: TeamMemberRole;
    invited_at: Date;
    invited_by: User;
}, "InvitedMember">;

export type TeamMemberOrInvitedMember = TeamMember | InvitedMember;

export type Team = Array<TeamMemberOrInvitedMember>;
