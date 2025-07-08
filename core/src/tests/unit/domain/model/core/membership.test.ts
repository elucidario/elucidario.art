import { describe, expect, it } from "vitest";
import { TeamMemberOrInvitedMember } from "@elucidario/mdorim";
import { Membership } from "@/domain/models/core";

describe("Membership Model", () => {
    it("should create a Membership instance with default values", () => {
        const member = new Membership();
        expect(member).toBeInstanceOf(Membership);
        expect(
            (member.schema as Map<string, string>).has("/core/TeamMember"),
        ).toBe(true);
        expect(
            (member.schema as Map<string, string>).has("/core/InvitedMember"),
        ).toBe(true);
    });

    it("should create a Membership instance with provided TeamMember data", () => {
        const teamMember: TeamMemberOrInvitedMember = {
            type: "TeamMember",
            _label: "Test Membership",
            user: {
                type: "User",
                username: "testuser",
                email: "testuser@example.com",
            },
            role: "editor",
            status: "active",
            email: "testuser@example.com",
        };
        const member = new Membership(teamMember);
        expect(member).toBeInstanceOf(Membership);
    });

    it("should create a Membership instance with provided InvitedMember data", () => {
        const invitedMember: TeamMemberOrInvitedMember = {
            type: "InvitedMember",
            _label: "Test Invited Member",
            email: "testuser@example.com",
            role: "editor",
            user: null,
        };
        const member = new Membership(invitedMember);
        expect(member).toBeInstanceOf(Membership);
    });
});
