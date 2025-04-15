import { Schema } from "@/types";

export type User = {
    email: string;
    userId?: string;
    name?: string;
    password?: string;
};

export const User: Schema = {
    id: "/core/User",
    type: "object",
    properties: {
        userId: {
            type: "string",
            format: "uuid",
        },
        name: {
            type: "string",
            minLength: 1,
            maxLength: 255,
        },
        email: {
            type: "string",
            format: "email",
        },
        password: {
            type: "string",
            minLength: 8,
            maxLength: 255,
        },
    },
    required: ["email"],
    additionalProperties: false,
    title: "User",
    description: "User schema",
};
