import { Workspace as WorkspaceType } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";
import { PropertyConstraint } from "@/types";

/**
 * # Workspace
 * The Workspace class provides methods to interact with the Workspace entity in the database.
 */
export class Workspace
    extends AModel<WorkspaceType>
    implements IModel<WorkspaceType>
{
    /**
     * ## Workspace.constraints
     * This property holds an array of Cypher constraints that should be applied to the model.
     * These constraints are used to ensure data integrity and uniqueness in the database.
     */
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

    /**
     * Creates a new instance of Workspace.
     * @param data - Optional initial data for the workspace.
     */
    constructor(data?: WorkspaceType) {
        super("/core/Workspace", data);
    }
}
