import { MdorimBase, MdorimError } from "@elucidario/mdorim";
import { ModelError } from "../errors";

export default interface IModel<T extends MdorimBase> {
    set(data?: T): void;

    get(): T;

    /**
     * ## checkSchemaType
     * This method checks the type of the schema property.
     * It throws an error if the schema is not a string or a Map.
     *
     * @returns "single" if the schema is a string, "multiple" if it is a Map
     * @throws MdorimError if the schema is not a string or a Map
     */
    checkSchemaType(): "single" | "multiple";

    /**
     * ## schemaName
     * This method returns the schema name based on the schema type.
     * If the schema is a string, it returns the string.
     * If the schema is a Map, it returns the value for the provided ID.
     *
     * @param id - ID to get the schema name for (required if schema is a Map)
     * @returns Schema name as a string
     * @throws MdorimError if the schema type is invalid or if the ID is not found in the Map
     */
    schemaName(id?: string): string;

    /**
     * ███████╗██████╗ ██████╗  ██████╗ ██████╗
     * ██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
     * █████╗  ██████╔╝██████╔╝██║   ██║██████╔╝
     * ██╔══╝  ██╔══██╗██╔══██╗██║   ██║██╔══██╗
     * ███████╗██║  ██║██║  ██║╚██████╔╝██║  ██║
     * ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
     */
    /**
     * Creates a new error based on the type and message.
     * @param error - The error to handle
     * @returns MdorimError or ModelError
     */
    error(error: unknown, statusCode: number): MdorimError | ModelError;
}
