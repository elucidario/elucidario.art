import { SchemaType } from "@/schema/types";

const InvitedMemberSchema: SchemaType = {
    id: "/core/InvitedMember",
    title: "i18n:invited_member",
    description: "description-invited_member",
    type: "object",
    properties: {
        email: {
            $ref: "/core/definitions#/definitions/email",
        },
        role: {
            $ref: "/core/definitions#/definitions/role",
        },
        invited_at: {
            $ref: "/core/definitions#/definitions/created_at",
        },
        invited_by: {
            $ref: "/core/User",
        },
    },
    required: ["email", "role", "invited_at", "invited_by"],
    additionalProperties: false,
};

export default InvitedMemberSchema;
