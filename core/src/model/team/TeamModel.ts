import {
    Email,
    InvitedMember,
    isMdorimError,
    TeamMember,
    TeamMemberOrInvitedMember,
    TeamMemberRole,
    User,
    UUID,
    Workspace,
} from "@elucidario/mdorim";
import AbstractModel from "../AbstractModel";
import { Expr } from "@neo4j/cypher-builder";
import { ManagedTransaction } from "neo4j-driver";
import Core from "@/Core";
import { UserModel, WorkspaceModel } from "@/model";

/**
 * # TeamModel
 * This class is responsible for managing team members and invited members in a workspace.
 */
export class TeamModel extends AbstractModel<TeamMemberOrInvitedMember> {
    static constraints: string[] = [
        "CREATE CONSTRAINT MemberUuidUnique IF NOT EXISTS\
        FOR (u:Member)\
        REQUIRE u.uuid IS UNIQUE",
        "CREATE CONSTRAINT MemberEmailUnique IF NOT EXISTS\
        FOR (u:Member)\
        REQUIRE u.email IS UNIQUE",
    ];

    /**
     * Constructor for the TeamModel class.
     * @param core - The core instance of the application.
     */
    constructor(core: Core) {
        super(["/core/InvitedMember", "/core/TeamMember"], core);
    }

    /**
     * Invite a member to a workspace.
     * @param workspaceID - The UUID of the workspace.
     * @param email - The email of the member to invite.
     * @param role - The role of the member in the workspace.
     * @returns A promise that resolves to an object containing the workspace and the invited member.
     */
    async inviteMember(
        workspaceID: UUID,
        email: Email,
        role: TeamMemberRole,
    ): Promise<{ workspace: Workspace; member: InvitedMember }> {
        try {
            await this.validateUUID(workspaceID);
            await this.validateEmail(email);
            await this.validateRole(role);

            return await this.core.graph.writeTransaction(async (tx) => {
                const userModel = new UserModel(this.core);
                const workspaceModel = new WorkspaceModel(this.core);

                const workspaceNode = this.core.cypher.NamedNode("workspace");

                const userNode = this.core.cypher.NamedNode("user");

                const invitedMemberNode =
                    this.core.cypher.NamedNode("invitedMember");

                const matchWorkspace = workspaceModel.queryRead(
                    { uuid: workspaceID },
                    "Workspace",
                    workspaceNode,
                    true,
                    false,
                );

                const matchUser = userModel.queryRead(
                    { email },
                    "User",
                    userNode,
                    true,
                    false,
                );

                const withClause = this.core.cypher.With(
                    workspaceNode,
                    userNode,
                );

                const createInvitedMember = this.core.cypher.Create(
                    this.core.cypher.Pattern(invitedMemberNode, {
                        labels: ["InvitedMember", "Member"],
                        properties: {
                            uuid: this.core.cypher.Uuid(),
                            email: this.core.cypher.Param(email),
                            role: this.core.cypher.Param(role),
                        },
                    }),
                );

                const createRelationship = this.core.cypher.Create(
                    this.core.cypher
                        .Pattern(invitedMemberNode)
                        .related(this.core.cypher.Relationship(), {
                            type: "INVITED_TO",
                        })
                        .to(workspaceNode),
                );

                const createRelationshipToUserConditionally = this.core.cypher
                    .Foreach(this.core.cypher.Variable())
                    .in(
                        this.core.cypher
                            .Case()
                            .when(this.core.cypher.notNull(userNode))
                            .then(
                                this.core.cypher.Param([
                                    this.core.cypher.Literal(1),
                                ]),
                            )
                            .else(this.core.cypher.Param([])),
                    )
                    .do(
                        this.core.cypher.Create(
                            this.core.cypher
                                .Pattern(invitedMemberNode)
                                .related(this.core.cypher.Relationship(), {
                                    type: "SAME_AS",
                                })
                                .to(userNode),
                        ),
                    )
                    .with(invitedMemberNode, userNode, workspaceNode);

                const returnClause = this.core.cypher.Return(
                    invitedMemberNode,
                    userNode,
                    workspaceNode,
                );

                const concat = this.core.cypher.concat(
                    matchWorkspace,
                    matchUser,
                    withClause,
                    createInvitedMember,
                    createRelationship,
                    createRelationshipToUserConditionally,
                    returnClause,
                );

                const { cypher, params: queryParams } = concat.build();

                const response = await tx.run(cypher, queryParams);

                if (response.records.length === 0) {
                    throw this.error(
                        `Cannot invite member to workspace ${workspaceID}.`,
                    );
                }
                const [record] = response.records;

                const workspace = this.parseResponse<Workspace>(
                    record.get("workspace").properties,
                );

                const invitedMember = record.get("invitedMember");

                const memberRecord = this.parseResponse<InvitedMember>({
                    ...invitedMember.properties,
                    type: invitedMember.labels[1],
                    user: record.get("user")
                        ? this.parseResponse(record.get("user").properties, [
                              "password",
                          ])
                        : null,
                });

                return {
                    workspace: workspace,
                    member: memberRecord,
                };
            });
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * Promote an invited member to a team member in a workspace.
     * @param workspaceID - The UUID of the workspace.
     * @param email - The email of the member to promote.
     * @param role - The role of the member in the workspace.
     * @returns A promise that resolves to an object containing the workspace and the promoted member.
     */
    async promoteToMember(
        workspaceID: UUID,
        email: Email,
        role: TeamMemberRole,
    ): Promise<{ workspace: Workspace; member: TeamMember }> {
        try {
            await this.validateUUID(workspaceID);
            await this.validateEmail(email);
            await this.validateRole(role);

            return await this.core.graph.writeTransaction(async (tx) => {
                const { user } = await this.verifyWorkspaceAndUser(
                    tx,
                    { uuid: workspaceID },
                    { email },
                );

                const { teamMemberRecord, userRecord, workspaceRecord } =
                    await this.runCreateTeamMember(tx, workspaceID, role, user);

                return {
                    workspace: workspaceRecord,
                    member: {
                        ...teamMemberRecord,
                        user: userRecord,
                        type: "TeamMember",
                    },
                };
            });
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * Delete a team member or invited member by their ID.
     * @param id - The UUID of the member to delete.
     * @returns A promise that resolves to a boolean indicating whether the member was successfully deleted.
     * @throws An error if the ID is invalid or if the deletion fails.
     */
    async delete(id: string): Promise<boolean> {
        try {
            await this.validateUUID(id);

            const { cypher, params } = this.queryDelete(id, ["Member"]).build();

            return await this.core.graph.executeQuery<boolean>(
                ({ records }) => {
                    if (records.length === 0) {
                        return false;
                    }
                    const [first] = records;
                    return first.get("removed") as boolean;
                },
                cypher,
                params,
            );
        } catch (error) {
            console.log(error);
            throw this.error(error);
        }
    }

    /**
     * Verify that the workspace and user exist in the database.
     * @param tx - The managed transaction.
     * @param workspace - Partial workspace object to match.
     * @param user - Partial user object to match.
     * @returns An object containing the verified user and workspace.
     * @throws An error if the workspace or user is not found.
     */
    private async verifyWorkspaceAndUser(
        tx: ManagedTransaction,
        workspace?: Partial<Workspace>,
        user?: Partial<User>,
    ): Promise<{ user: User; workspace: Workspace }> {
        if (!workspace || !user) {
            throw this.error("Workspace and User parameters are required.");
        }
        const userModel = new UserModel(this.core);
        const workspaceModel = new WorkspaceModel(this.core);

        const workspaceNode = this.core.cypher.NamedNode("workspace");
        const userNode = this.core.cypher.NamedNode("user");

        const matchUser = userModel.queryRead(
            user,
            "User",
            userNode,
            false,
            false,
        );

        const matchWorkspace = workspaceModel.queryRead(
            workspace,
            "Workspace",
            workspaceNode,
            false,
            false,
        );

        const returnMatch = this.core.cypher.Return(workspaceNode, userNode);

        const concat = this.core.cypher.concat(
            matchWorkspace,
            matchUser,
            returnMatch,
        );

        const { cypher, params } = concat.build();

        const userWorkspaceResponse = await tx.run(cypher, params);

        if (userWorkspaceResponse.records.length === 0) {
            throw this.error(`User or Workspace not found`);
        }

        const userRecord = this.parseResponse<User>(
            userWorkspaceResponse.records[0].get("user").properties,
            ["password"],
        );

        const workspaceRecord = this.parseResponse<Workspace>(
            userWorkspaceResponse.records[0].get("workspace").properties,
        );

        return {
            user: userRecord,
            workspace: workspaceRecord,
        };
    }

    /**
     * Create a team member in a workspace.
     * @param tx - The managed transaction.
     * @param workspaceID - The UUID of the workspace.
     * @param role - The role of the team member.
     * @param user - Partial user object containing user details.
     * @returns An object containing the created team member, user, and workspace records.
     */
    private async runCreateTeamMember(
        tx: ManagedTransaction,
        workspaceID: UUID,
        role: TeamMemberRole,
        user: Partial<User>,
    ) {
        const userNode = this.core.cypher.NamedNode("user");
        const workspaceNode = this.core.cypher.NamedNode("workspace");
        const memberNode = this.core.cypher.NamedNode("teamMember");
        const sameAsRelationship =
            this.core.cypher.NamedRelationship("sameAsRelationship");
        const invitedRelationship = this.core.cypher.NamedRelationship(
            "invitedRelationship",
        );
        const memberOfRelationship = this.core.cypher.NamedRelationship(
            "memberOfRelationship",
        );

        const matchInvitedMember = this.core.cypher
            .Match(
                this.core.cypher
                    .Pattern(userNode, {
                        labels: ["User"],
                        properties: Object.keys(user).reduce(
                            (acc, key) => {
                                acc[key] = this.core.cypher.Param(
                                    user[key as keyof User],
                                );
                                return acc;
                            },
                            {} as Record<string, Expr>,
                        ),
                    })
                    .related(sameAsRelationship, {
                        type: "SAME_AS",
                        direction: "left",
                    })
                    .to(memberNode, {
                        labels: ["InvitedMember"],
                        properties: {
                            email: this.core.cypher.Param(user.email),
                            role: this.core.cypher.Param(role),
                        },
                    })
                    .related(invitedRelationship, {
                        type: "INVITED_TO",
                    })
                    .to(workspaceNode, {
                        labels: ["Workspace"],
                        properties: {
                            uuid: this.core.cypher.Param(workspaceID),
                        },
                    }),
            )
            .delete(invitedRelationship)
            .remove(memberNode.label("InvitedMember"))
            .set(memberNode.label("TeamMember"));

        const newRelationship = this.core.cypher
            .Create(
                this.core.cypher
                    .Pattern(memberNode)
                    .related(memberOfRelationship, {
                        type: "MEMBER_OF",
                    })
                    .to(workspaceNode),
            )
            .with(
                memberNode,
                userNode,
                workspaceNode,
                sameAsRelationship,
                memberOfRelationship,
            );

        const returnClause = this.core.cypher.Return(
            memberNode,
            sameAsRelationship,
            userNode,
            workspaceNode,
            memberOfRelationship,
        );

        const concat = this.core.cypher
            .concat(matchInvitedMember, newRelationship, returnClause)
            .build();

        const response = await tx.run(concat.cypher, concat.params);

        if (response.records.length === 0) {
            throw this.error(
                `Cannot create team member in workspace ${workspaceID}.`,
            );
        }

        const teamMemberRecord = this.parseResponse<TeamMember>(
            response.records[0].get("teamMember").properties,
        );

        const userRecord = this.parseResponse<User>(
            response.records[0].get("user").properties,
        );

        const workspaceRecord = this.parseResponse<Workspace>(
            response.records[0].get("workspace").properties,
        );

        return {
            teamMemberRecord,
            userRecord,
            workspaceRecord,
        };
    }

    /**
     * Validate the role of a team member.
     * @param role - The role to validate.
     * @returns A promise that resolves to a boolean indicating whether the role is valid.
     * @throws An error if the validation fails.
     */
    async validateRole(role: unknown): Promise<boolean> {
        try {
            const isValid = await this.core.mdorim.validate(
                "/core/Definitions#/$defs/role",
                role,
            );

            if (isMdorimError(isValid)) {
                throw isValid;
            }

            return isValid;
        } catch (error) {
            throw this.error(error);
        }
    }
}
