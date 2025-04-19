import { Schema } from "@/types";

export const definitions: Schema = {
    id: "/core/definitions",
    type: "object",
    definitions: {
        number: {
            type: "number",
        },
        created_at: {
            type: "string",
            format: "date-time",
        },
        updated_at: {
            type: "string",
            format: "date-time",
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
        role: {
            type: "string",
            enum: ["admin", "editor", "assistant", "researcher", "viewer"],
        },
        description: {
            type: "string",
            minLength: 1,
        },
        uuid: {
            type: "string",
            format: "uuid",
        },
    },
};
