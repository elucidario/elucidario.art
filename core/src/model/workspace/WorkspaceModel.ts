import AbstractModel from "@/model/AbstractModel";

import { isMdorimError, Workspace } from "@elucidario/mdorim";
import Core from "@/Core";
import { PropertyConstraint } from "@/types";

/**
 * # WorkspaceModel
 * The WorkspaceModel class provides methods to interact with the Workspace entity in the database.
 */
export class WorkspaceModel extends AbstractModel<Workspace> {
    /**
     * Constraints for the Workspace entity.
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
     * Creates a new instance of WorkspaceModel.
     * @param core - The core instance to use for database operations.
     */
    constructor(core: Core) {
        super("/core/Workspace", core);
    }

    /**
     * Creates a new workspace in the database.
     * @param workspace - The workspace data to create.
     * @returns The created workspace.
     * @throws MdorimError if the workspace is invalid or creation fails.
     */
    async create(workspace: Partial<Workspace>): Promise<Workspace> {
        try {
            await this.validateEntity(workspace);

            // write to the database
            return await this.core.graph.writeTransaction(async (tx) => {
                const { cypher, params } = this.queryCreate(
                    workspace,
                    "Workspace",
                ).build();

                const response = await tx.run(cypher, params);
                if (response.records.length === 0) {
                    throw this.error("Workspace not created");
                }
                const [first] = response.records;

                const record = this.parseResponse<Workspace>(
                    first.get("u").properties,
                );

                return record;
            });
        } catch (e: unknown) {
            throw this.error(e);
        }
    }

    /**
     * Reads a workspace from the database.
     * @param id - The ID of the workspace to read.
     * @returns The workspace data or null if not found.
     * @throws MdorimError if the ID is invalid or reading fails.
     */
    async read(id: string): Promise<Workspace | null> {
        try {
            await this.validateUUID(id);

            const { cypher, params } = this.queryRead(
                { uuid: id },
                "Workspace",
            ).build();

            return await this.core.graph.executeQuery<Workspace | null>(
                (response) => {
                    if (response.records.length === 0) {
                        return null;
                    }

                    const [first] = response.records;

                    return this.parseResponse<Workspace>(
                        first.get("u").properties,
                    );
                },
                cypher,
                params,
            );
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Updates a workspace in the database.
     * @param id - The ID of the workspace to update.
     * @param args - The new data for the workspace.
     * @returns The updated workspace.
     * @throws MdorimError if the ID is invalid, the data is invalid, or updating fails.
     */
    async update(id: string, args: Partial<Workspace>): Promise<Workspace> {
        try {
            await this.validateUUID(id);
            await this.validateEntity(args);

            const { cypher, params } = this.queryUpdate(
                id,
                args,
                "Workspace",
            ).build();

            return await this.core.graph.executeQuery<Workspace>(
                (response) => {
                    if (response.records.length === 0) {
                        throw this.error("Workspace not found");
                    }

                    const [first] = response.records;

                    return this.parseResponse<Workspace>(
                        first.get("u").properties,
                    );
                },
                cypher,
                params,
            );
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Deletes a workspace from the database.
     * @param id - The ID of the workspace to delete.
     * @returns true if the workspace was deleted, false otherwise.
     * @throws MdorimError if the ID is invalid or deletion fails.
     */
    async delete(id: string): Promise<boolean> {
        try {
            await this.validateUUID(id);

            const { cypher, params } = this.queryDelete(
                id,
                "Workspace",
            ).build();

            return await this.core.graph.executeQuery<boolean>(
                ({ records }) => {
                    if (records.length === 0) {
                        throw this.error("Workspace not found");
                    }

                    const [first] = records;
                    return first.get("removed") as boolean;
                },
                cypher,
                params,
            );
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Lists all workspaces in the database.
     * @param limit - The maximum number of workspaces to return.
     * @param offset - The number of workspaces to skip before starting to collect the result set.
     * @returns An array of workspaces.
     * @throws MdorimError if the limit or offset is invalid or listing fails.
     */
    async list(limit?: number, offset?: number): Promise<Workspace[]> {
        try {
            await this.validateNumber(limit, true);
            await this.validateNumber(offset, true);

            const { cypher, params } = this.queryList(
                limit,
                offset,
                "Workspace",
            ).build();

            return await this.core.graph.executeQuery<Workspace[]>(
                (response) => {
                    const { records } = response;

                    if (records.length === 0) {
                        return [];
                    }

                    return records.map((record) => {
                        return this.parseResponse<Workspace>(
                            record.get("u").properties,
                        );
                    });
                },
                cypher,
                params,
            );
        } catch (e) {
            console.log(e);
            throw this.error(e);
        }
    }

    /**
     * Retrieves a workspace by its name.
     * @param name - The name of the workspace to retrieve.
     * @returns The workspace if found, or null if not found.
     * @throws MdorimError if the name is invalid or retrieval fails.
     */
    async getByName(name: string): Promise<Workspace | null> {
        try {
            await this.validateName(name);

            const { cypher, params } = this.queryRead(
                { name },
                "Workspace",
            ).build();

            return await this.core.graph.executeQuery<Workspace | null>(
                (response) => {
                    if (response.records.length === 0) {
                        return null;
                    }

                    const [first] = response.records;
                    return this.parseResponse<Workspace>(
                        first.get("u").properties,
                    );
                },
                cypher,
                params,
            );
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Validates username against the string schema.
     * @param username - username to validate
     * @returns true if the username is valid, throws an MdorimError if it is not
     * @throws MdorimError
     */
    async validateName(name: unknown): Promise<true> {
        try {
            const isValid = await this.core.mdorim.validate(
                "/core/Definitions#/$defs/name",
                name,
            );

            if (isMdorimError(isValid)) {
                throw isValid;
            }

            return isValid;
        } catch (error) {
            throw this.error(error);
        }
    }
}
