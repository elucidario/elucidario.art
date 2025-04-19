import { Entity, Schema } from "@/types";
import { Team } from "./team";

export type Workspace = Entity<{
    name: string;
    workspace_id?: string;
    team?: Team;
    description?: string;
    organization?: string;
}>;

export const Workspace: Schema = {
    id: "/core/Workspace",
    type: "object",
    properties: {
        workspace_id: {
            $ref: "/core/definitions#/definitions/uuid",
        },
        name: {
            $ref: "/core/definitions#/definitions/name",
        },
        description: {
            $ref: "/core/definitions#/definitions/description",
        },
        created_at: {
            $ref: "/core/definitions#/definitions/created_at",
        },
        updated_at: {
            $ref: "/core/definitions#/definitions/updated_at",
        },
        team: {
            $ref: "/core/Workspace/team",
        },
        // organization: {
        //     $ref: "/linked-art/Organization",
        // },
    },
    required: ["name"],
};
