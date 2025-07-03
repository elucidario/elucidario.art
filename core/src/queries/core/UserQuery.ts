import { Cypher } from "@/db";
import { AbstractQuery } from "../AbstractQuery";
import { Hooks, PropertyConstraint } from "@/types";
import { User } from "@elucidario/mdorim";

export class UserQuery extends AbstractQuery<User> {
    constraints: PropertyConstraint[] = [
        {
            name: "user_unique_uuid",
            labels: ["User"],
            prop: "uuid",
        },
        {
            name: "user_unique_username",
            labels: ["User"],
            prop: "username",
        },
        {
            name: "user_unique_email",
            labels: ["User"],
            prop: "email",
        },
    ];

    constructor(cypher: Cypher, hooks: Hooks) {
        super(cypher, hooks);
    }
}
