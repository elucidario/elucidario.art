import { UserProps, Email } from "@/types";

export type TeamMemberRoleEnum = "admin" | "editor" | "assistant" | "viewer";

export type InvitedAt = Date;

export type TeamMemberProps = {
    user: UserProps;
    role: TeamMemberRoleEnum;
};

export type InvitedMemberProps = {
    email: Email;
    role: TeamMemberRoleEnum;
    invited_at: InvitedAt;
    invited_by: UserProps;
};

export type TeamProps = Array<TeamMemberProps | InvitedMemberProps>;
