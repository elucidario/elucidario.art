import {
    MdorimBase,
    TeamMemberRole,
    User,
    Workspace,
} from "@elucidario/mdorim";

export type SysadminRole = "sysadmin";

export type AuthContext<T extends Partial<MdorimBase>> = {
    user: User;
    role: TeamMemberRole | SysadminRole; // there is no user without a role
    workspace?: Workspace;
    entity?: T;
};
