import { Schema } from "@/types";
import { User } from "../user";

export type TeamMember = {
    user: User;
    role: "admin" | "editor" | "assistant" | "viewer";
};

export type Team = Array<TeamMember>;

export const Team: Schema = {
    id: "/core/Workspace/team",
    type: "array",
    items: {
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
    },
    minItems: 1,
    uniqueItems: true,
    additionalProperties: false,
    title: "Team",
    description: "Team schema",
};
