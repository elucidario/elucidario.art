import { Schema } from "@/types";

export const Workspace: Schema = {
    id: "/core/Workspace",
    type: "object",
    properties: {
        workspaceId: {
            type: "string",
            format: "uuid",
        },
        name: {
            type: "string",
            minLength: 1,
            maxLength: 255,
        },
        description: {
            type: "string",
            minLength: 1,
        },
        organization: {
            $ref: "/linked-art/Organization",
        },
    },
    required: ["name"],
};
