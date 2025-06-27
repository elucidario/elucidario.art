import { Workspace } from "@elucidario/mdorim";
import { AbstractQuery } from "../AbstractQuery";
import { Hooks, PropertyConstraint } from "@/types";
import { Cypher } from "@/db";

export class WorkspaceQuery extends AbstractQuery<Workspace> {
    constraints: PropertyConstraint[] = [
        {
            name: "workspace_unique_uuid",
            labels: ["Workspace"],
            prop: "uuid",
        },
        {
            name: "workspace_unique_name",
            labels: ["Workspace"],
            prop: "name",
        },
    ];

    constructor(cypher: Cypher, hooks: Hooks) {
        super(cypher, hooks);
    }
}
