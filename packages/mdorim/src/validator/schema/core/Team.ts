import { Schema } from "@/validator/schema/types";

const TeamSchema: Schema = {
    id: "/core/Team",
    title: "i18n:team",
    description: "description-team",
    type: "array",
    items: {
        anyOf: [
            {
                $ref: "/core/TeamMember",
            },
            {
                $ref: "/core/InvitedMember",
            },
        ],
    },
    minItems: 1,
    uniqueItems: true,
    additionalProperties: false,
};

export default TeamSchema;
