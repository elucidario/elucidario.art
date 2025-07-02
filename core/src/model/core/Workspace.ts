import { Mdorim, Workspace as WorkspaceType } from "@elucidario/mdorim";

import AbstractModel from "@/model/AbstractModel";
import InterfaceModel from "@/model/InterfaceModel";

/**
 * # Workspace
 * The Workspace class provides methods to interact with the Workspace entity in the database.
 */
export class Workspace
    extends AbstractModel<WorkspaceType>
    implements InterfaceModel<WorkspaceType>
{
    /**
     * Creates a new instance of Workspace.
     * @param mdorim - The mdorim instance to use for validation.
     * @param data - Optional initial data for the workspace.
     */
    constructor(mdorim: Mdorim, data?: WorkspaceType | null) {
        super("/core/Workspace", mdorim, data);
    }

    /**
     * Validates username against the string schema.
     * @param username - username to validate
     * @returns true if the username is valid, throws an MdorimError if it is not
     * @throws MdorimError
     */
    async validateName(name: unknown): Promise<boolean> {
        try {
            return await this.validate(name, "/core/Definitions#/$defs/name");
        } catch (error) {
            throw this.error(error);
        }
    }
}
