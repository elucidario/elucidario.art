import { SchemaType } from "@/validator/schema/types";

const UserSchema: SchemaType = {
    id: "/core/User",
    type: "object",
    title: "i18n:user",
    description: "i18n:user/description",
    properties: {
        uuid: {
            $ref: "/core/definitions#/definitions/uuid",
        },
        name: {
            $ref: "/core/definitions#/definitions/name",
        },
        email: {
            $ref: "/core/definitions#/definitions/email",
        },
        password: {
            $ref: "/core/definitions#/definitions/password",
        },
        created_at: {
            $ref: "/core/definitions#/definitions/created_at",
        },
        updated_at: {
            $ref: "/core/definitions#/definitions/updated_at",
        },
    },
    required: ["email"],
    additionalProperties: false,
};

export default UserSchema;
