import { Workspace as WorkspaceType } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";
import { AuthContext, Hooks, PropertyConstraint } from "@/types";
import { MongoAbility, RawRuleOf } from "@casl/ability";

/**
 * # Workspace
 * The Workspace class provides methods to interact with the Workspace entity in the database.
 */
export class Workspace
    extends AModel<WorkspaceType>
    implements IModel<WorkspaceType> {
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
    constructor(
        data?: WorkspaceType | null,
        protected hooks?: Hooks,
    ) {
        super("/core/Workspace", data, hooks);
    }

    /**
     * ## Sets the abilities for the user based on their role.
     * This method modifies the abilities array to include management permissions.
     *
     * @param abilities - The current abilities array.
     * @param context - The authentication context containing user and role information.
     * @returns The modified abilities array.
     */
    protected setAbilities(
        abilities: RawRuleOf<MongoAbility>[],
        context: AuthContext,
    ): RawRuleOf<MongoAbility>[] {
        const { role } = context;

        if (["admin", "sysadmin"].includes(role)) {
            abilities.push({
                action: "manage",
                subject: "Workspace",
            });
        }

        return abilities;
    }
}
