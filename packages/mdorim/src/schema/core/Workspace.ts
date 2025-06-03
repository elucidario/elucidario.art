import { SchemaType } from "@/schema/types";

const WorkspaceSchema: SchemaType = {
    id: "/core/Workspace",
    title: "i18n:workspace",
    description: "i18n:workspace/description",
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
            $ref: "/core/Team",
        },
        // organization: {
        //     $ref: "/linked-art/Organization",
        // },
    },
    additionalProperties: false,
    required: ["name"],
};

export default WorkspaceSchema;
