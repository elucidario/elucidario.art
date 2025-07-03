import { Cypher } from "@/db";
import { AbstractQuery } from "../AbstractQuery";
import { Hooks, PropertyConstraint } from "@/types";
import {
    Email,
    TeamMemberOrInvitedMember,
    TeamMemberRole,
    User,
    UUID,
    Workspace,
} from "@elucidario/mdorim";
import { CompositeClause, Expr } from "@neo4j/cypher-builder";

export class MembershipQuery extends AbstractQuery<TeamMemberOrInvitedMember> {
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

    constructor(cypher: Cypher, hooks: Hooks) {
        super(cypher, hooks);
    }

    /**
     * Verify that the workspace and user exist in the database.
     * @param tx - The managed transaction.
     * @param workspace - Partial workspace object to match.
     * @param user - Partial user object to match.
     * @returns An object containing the verified user and workspace.
     * @throws An error if the workspace or user is not found.
     */
    verifyWorkspaceAndUser({
        workspace,
        user,
        returnClause = false,
    }: {
        workspace?: Partial<Workspace>;
        user?: Partial<User>;
        returnClause?: boolean;
    }): CompositeClause {
        if (!workspace || !user) {
            throw this.error("Workspace and User parameters are required.");
        }

        const workspaceNode = this.cypher.NamedNode("workspace");
        const userNode = this.cypher.NamedNode("user");

        const matchUser = this.cypher.Match(
            this.cypher.Pattern(userNode, {
                labels: ["User"],
                properties: Object.entries(user).reduce(
                    (acc, [key, value]) => {
                        acc[key] = this.cypher.Param(value);
                        return acc;
                    },
                    {} as Record<string, Expr>,
                ),
            }),
        );

        const matchWorkspace = this.cypher.Match(
            this.cypher.Pattern(workspaceNode, {
                labels: ["Workspace"],
                properties: Object.entries(workspace).reduce(
                    (acc, [key, value]) => {
                        acc[key] = this.cypher.Param(value);
                        return acc;
                    },
                    {} as Record<string, Expr>,
                ),
            }),
        );

        const returnMatch = this.cypher.Return(workspaceNode, userNode);

        const concat = this.cypher.concat(
            matchWorkspace,
            matchUser,
            returnClause ? returnMatch : undefined,
        );

        return concat;
    }

    inviteToWorkspace({
        workspaceUUID,
        email,
        role,
    }: {
        workspaceUUID: UUID;
        email: Email;
        role: TeamMemberRole;
    }) {
        const workspaceNode = this.cypher.NamedNode("workspace");
        const matchWorkspace = this.read({
            data: { uuid: workspaceUUID },
            labels: "Workspace",
            node: workspaceNode,
            returnClause: false,
        });

        const userNode = this.cypher.NamedNode("user");
        const matchUser = this.read({
            data: { email },
            labels: "User",
            node: userNode,
            returnClause: false,
            optionalMatch: true,
        });

        const withClause = this.cypher.With(workspaceNode, userNode);

        const invitedMemberNode = this.cypher.NamedNode("invitedMember");
        const createInviteMember = this.cypher.Create(
            this.cypher.Pattern(invitedMemberNode, {
                labels: ["InvitedMember", "Member"],
                properties: {
                    uuid: this.cypher.Uuid(),
                    email: this.cypher.Param(email),
                    role: this.cypher.Param(role),
                },
            }),
        );

        const inviteToWorkspace = this.cypher.Create(
            this.cypher
                .Pattern(invitedMemberNode)
                .related(this.cypher.Relationship(), {
                    type: "INVITED_TO",
                })
                .to(workspaceNode),
        );

        const createRelWithUserConditionally = this.cypher
            .Foreach(this.cypher.Variable())
            .in(
                this.cypher
                    .Case()
                    .when(this.cypher.notNull(userNode))
                    .then(this.cypher.Param([this.cypher.Literal(1)]))
                    .else(this.cypher.Param([])),
            )
            .do(
                this.cypher.Create(
                    this.cypher
                        .Pattern(invitedMemberNode)
                        .related(this.cypher.Relationship(), {
                            type: "SAME_AS",
                        })
                        .to(userNode),
                ),
            )
            .with(invitedMemberNode, userNode, workspaceNode);

        const returnClause = this.cypher.Return(
            invitedMemberNode,
            workspaceNode,
            userNode,
        );

        return this.cypher.concat(
            matchWorkspace,
            matchUser,
            withClause,
            createInviteMember,
            inviteToWorkspace,
            createRelWithUserConditionally,
            returnClause,
        );
    }

    addToWorkspace({
        workspaceUUID,
        userUUID,
        role,
    }: {
        workspaceUUID: UUID;
        userUUID: UUID;
        role: TeamMemberRole;
    }) {
        const workspaceNode = this.cypher.NamedNode("workspace");
        const userNode = this.cypher.NamedNode("user");
        const member = this.cypher.NamedNode("invitedMember");
        const memberOf = this.cypher.NamedRelationship("memberOf");

        const matchWorkspace = this.read({
            data: { uuid: workspaceUUID },
            labels: "Workspace",
            node: workspaceNode,
            returnClause: false,
        });

        const matchUser = this.read({
            data: { uuid: userUUID },
            labels: "User",
            node: userNode,
            returnClause: false,
        });

        const mergeMember = this.create({
            data: { role },
            labels: ["TeamMember", "Member"],
            node: member,
            returnClause: false,
        });

        const mergeWorkspaceMember = this.cypher
            .Merge(
                this.cypher
                    .Pattern(userNode)
                    .related(this.cypher.Relationship(), {
                        type: "SAME_AS",
                    })
                    .to(member)
                    .related(memberOf, {
                        type: "MEMBER_OF",
                    })
                    .to(workspaceNode),
            )
            .with(member, userNode, memberOf, workspaceNode)
            .return(member, userNode, memberOf, workspaceNode);

        return this.cypher.concat(
            matchWorkspace,
            matchUser,
            mergeMember,
            mergeWorkspaceMember,
        );
    }
}
