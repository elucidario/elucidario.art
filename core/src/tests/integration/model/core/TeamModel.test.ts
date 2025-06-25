import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { InvitedMember, TeamMember, UUID, Workspace } from "@elucidario/mdorim";

import { WorkspaceModel, UserModel, TeamModel } from "@/model";
import Core from "@/Core";

describe("TeamModel", () => {
    let model: TeamModel;
    let workspaceModel: WorkspaceModel;
    let userModel: UserModel | undefined;
    let invitedMember: { workspace: Workspace; member: InvitedMember };
    let secondInvitedMember: { workspace: Workspace; member: InvitedMember };
    let member: { workspace: Workspace; member: TeamMember };
    let workspace: UUID | undefined;

    beforeAll(async () => {
        try {
            const core = new Core();
            model = new TeamModel(core);
            userModel = new UserModel(core);
            workspaceModel = new WorkspaceModel(core);
            await core.setup();

            const hasWorkspace = await workspaceModel.getByName(
                "Test Workspace from TeamModel.test",
            );
            if (hasWorkspace) {
                workspace = hasWorkspace.uuid;
            } else {
                const createdWorkspace = await workspaceModel.create({
                    name: "Test Workspace from TeamModel.test",
                });
                workspace = createdWorkspace.uuid;
            }

            const hasUser = await userModel.getByEmail("test@example.com");
            if (!hasUser) {
                await userModel.create({
                    email: "test@example.com",
                    username: "testuser",
                    password: "password123",
                });
                // user = createdUser.uuid;
            }
        } catch (error) {
            console.error("Error in beforeAll:", error);
            throw error;
        }
    });

    afterAll(async () => {
        const user = await userModel!.getByEmail("test@example.com");
        if (user) {
            await userModel!.delete(user.uuid!);
        }
        if (workspace) {
            await workspaceModel.delete(workspace);
        }
    });

    it("should be defined", () => {
        expect(model).toBeDefined();
    });

    it("should have a inviteMember method", () => {
        expect(model.inviteMember).toBeDefined();
        expect(typeof model.inviteMember).toBe("function");
    });

    // it("should have a read method", () => {
    //     expect(model.read).toBeDefined();
    //     expect(typeof model.read).toBe("function");
    // });

    // it("should have an update method", () => {
    //     expect(model.update).toBeDefined();
    //     expect(typeof model.update).toBe("function");
    // });

    it("should have a delete method", () => {
        expect(model.delete).toBeDefined();
        expect(typeof model.delete).toBe("function");
    });

    // it("should have a list method", () => {
    //     expect(model.list).toBeDefined();
    //     expect(typeof model.list).toBe("function");
    // });

    describe("CREATE", async () => {
        it("should inviteMember with registered user", async () => {
            invitedMember = await model.inviteMember(
                workspace!,
                "test@example.com",
                "admin",
            );
            expect(invitedMember).toBeDefined();
            expect(invitedMember.workspace).toBeDefined();
            expect(invitedMember.member.user).toBeDefined();
            expect(invitedMember.member.role).toBe("admin");
            expect(invitedMember.member.type).toBe("InvitedMember");
            expect(invitedMember.member.uuid).toBeDefined();
            expect(invitedMember.member.email).toBe("test@example.com");
        });

        it("should inviteMember with no user registered", async () => {
            secondInvitedMember = await model.inviteMember(
                workspace!,
                "banana@example.com",
                "admin",
            );
            expect(secondInvitedMember).toBeDefined();
            expect(secondInvitedMember.workspace).toBeDefined();
            expect(secondInvitedMember.member.role).toBe("admin");
            expect(secondInvitedMember.member.user).toBeNull();
            expect(secondInvitedMember.member.type).toBe("InvitedMember");
            expect(secondInvitedMember.member.uuid).toBeDefined();
            expect(secondInvitedMember.member.email).toBe("banana@example.com");
        });

        it("should promote to TeamMember", async () => {
            member = await model.promoteToMember(
                workspace!,
                "test@example.com",
                "admin",
            );
            expect(member).toBeDefined();
            expect(member.workspace).toBeDefined();
            expect(member.member.role).toBe("admin");
            expect(member.member.user).toBeDefined();
            expect(member.member.type).toBe("TeamMember");
            expect(member.member.uuid).toBeDefined();
            expect(member.member.email).toBe("test@example.com");
        });

        describe("should throw", () => {
            it("should throw if Member already exists", async () => {
                await expect(
                    async () =>
                        await model.inviteMember(
                            workspace!,
                            "test@example.com",
                            "admin",
                        ),
                ).rejects.toThrow();
            });
        });
    });

    describe("DELETE", () => {
        it("should delete a member", async () => {
            const first = await model.delete(invitedMember.member.uuid!);
            const second = await model.delete(secondInvitedMember.member.uuid!);
            expect(first).toBe(true);
            expect(second).toBe(true);
        });
    });
});
