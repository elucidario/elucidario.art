import { Entity, Schema } from "@/types";

export type User = Entity<{
    email: string;
    user_id?: string;
    name?: string;
    password?: string;
}>;

export const User: Schema = {
    id: "/core/User",
    type: "object",
    properties: {
        user_id: {
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
    title: "User",
    description: "User schema",
};
