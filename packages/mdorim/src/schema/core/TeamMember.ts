import { SchemaType } from "@/schema/types";

const TeamMemberSchema: SchemaType = {
    id: "/core/TeamMember",
    title: "i18n:team_member",
    description: "description-team_member",
    type: "object",
    properties: {
        user: {
            $ref: "/core/User",
        },
        role: {
            $ref: "/core/definitions#/definitions/role",
        },
    },
    required: ["user", "role"],
    additionalProperties: false,
};

export default TeamMemberSchema;
