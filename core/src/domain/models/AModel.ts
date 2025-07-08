import { isMdorimError, MdorimBase, MdorimError } from "@elucidario/mdorim";

import IModel from "./IModel";
import { isModelError, ModelError } from "@/domain/errors";
import { PropertyConstraint } from "@/types";

/**
 * # AModel
 * This abstract class provides a base for all models in the application.
 */
export default abstract class AModel<T extends MdorimBase>
    implements IModel<T>
{
    /**
     * ## AbstractQuery.constraints
     * This static property holds an array of Cypher constraints that should be applied to the model.
     * These constraints are used to ensure data integrity and uniqueness in the database.
     */
    abstract constraints: PropertyConstraint[];

    /**
     * ## AbstractModel.data
     * This property holds the data for the model.
     * It can be a single object, or undefined.
     * It is protected to allow access in subclasses.
     */
    protected data?: T;

    /**
     * ## AbstractModel.schema
     * This property holds the schema for the model.
     * It can be a string representing a single schema or a Map of strings representing multiple schemas.
     * The schema is used to validate the data before saving it to the database.
     */
    schema: string | Map<string, string>;

    /**
     * # AbstractModel
     * This is an abstract class that provides a base for all models in the application.
     *
     * @param schema - The schema to use for the model. It can be a string or a Array of strings.
     * @param data - Optional initial data for the model.
     * @throws MdorimError if the schema is not a string or a Map
     */
    constructor(schema: string | string[], data?: T) {
        this.schema = Array.isArray(schema)
            ? new Map(schema.map((s) => [s, s]))
            : schema;
        this.checkSchemaType();
        this.set(data);
    }

    /**
     * ## set
     * This method sets the data for the model.
     * It can accept a single object, an array of objects, or null.
     *
     * @param data - The data to set for the model. It can be a single object, an array of objects, or null.
     */
    public set(data?: T): void {
        this.data = data;
    }

    /**
     * ## get
     * This method returns the data for the model.
     * It can return a single object, an array of objects, null, or undefined.
     *
     * @returns The data for the model. It can be a single object, an array of objects, null, or undefined.
     */
    public get(): T {
        try {
            if (!this.data) {
                throw this.error(
                    "Data is not set. Please set the data before getting it.",
                );
            }
            return this.data;
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * ## checkSchemaType
     * This method checks the type of the schema property.
     * It throws an error if the schema is not a string or a Map.
     *
     * @returns "single" if the schema is a string, "multiple" if it is a Map
     * @throws MdorimError if the schema is not a string or a Map
     */
    public checkSchemaType(): "single" | "multiple" {
        if (typeof this.schema === "string") {
            return "single";
        } else if (this.schema instanceof Map) {
            return "multiple";
        } else {
            throw new MdorimError(
                `Schema must be a string or a Map, got ${typeof this.schema}`,
            );
        }
    }

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
    public schemaName(id?: string): string {
        try {
            if (this.checkSchemaType() === "single") {
                return this.schema as string;
            } else if (this.checkSchemaType() === "multiple") {
                if (!id) {
                    throw new MdorimError(
                        "ID is required for multiple schemas",
                    );
                }
                const schemaName = (this.schema as Map<string, string>).get(id);
                if (!schemaName) {
                    throw new MdorimError(
                        `Schema for ID "${id}" not found in the provided Map.`,
                    );
                }
                return schemaName;
            }
            throw new MdorimError("Invalid schema type");
        } catch (error) {
            throw this.error(error);
        }
    }

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
    error(error: unknown, statusCode: number = 500): MdorimError | ModelError {
        if (isMdorimError(error)) {
            return error as MdorimError;
        }
        if (isModelError(error)) {
            return error as ModelError;
        }
        return new ModelError(error, statusCode);
    }
}
