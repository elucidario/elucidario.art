import { SchemaType } from "@/schema/types";

const definitions: SchemaType = {
    id: "/core/definitions",
    type: "object",
    definitions: {
        number: {
            type: "number",
        },
        created_at: {
            title: "i18n:created_at",
            type: "string",
            format: "date-time",
        },
        updated_at: {
            title: "i18n:updated_at",
            type: "string",
            format: "date-time",
        },
        name: {
            title: "i18n:name",
            type: "string",
            minLength: 1,
            maxLength: 255,
        },
        email: {
            title: "i18n:email",
            type: "string",
            format: "email",
        },
        password: {
            title: "i18n:senha",
            type: "string",
            minLength: 8,
            maxLength: 255,
        },
        role: {
            title: "i18n:role",
            type: "string",
            enum: ["admin", "editor", "assistant", "researcher", "viewer"],
        },
        description: {
            title: "i18n:description",
            type: "string",
            minLength: 1,
        },
        uuid: {
            title: "i18n:uuid",
            type: "string",
            format: "uuid",
        },
    },
};

export default definitions;
