import { isMdorimError, Mdorim, MdorimError } from "@elucidario/mdorim";

import InterfaceModel from "./InterfaceModel";

/**
 * # AbstractModel
 * This abstract class provides a base for all models in the application.
 */
export default abstract class AbstractModel<T extends Record<string, unknown>>
    implements InterfaceModel<T>
{
    data?: T | null;

    /**
     * ## mdorim
     * This property holds the instance of the Mdorim class, which is used for schema validation.
     * It is initialized in the constructor and used for validating data against the schema.
     */
    protected mdorim: Mdorim;

    /**
     * ## AbstractModel.schema
     * This property holds the schema for the model.
     * It can be a string representing a single schema or a Map of strings representing multiple schemas.
     * The schema is used to validate the data before saving it to the database.
     */
    protected schema: string | Map<string, string>;

    /**
     * # AbstractModel
     * This is an abstract class that provides a base for all models in the application.
     *
     * @param schema - The schema to use for the model. It can be a string or a Array of strings.
     * @param mdorim - The instance of the Mdorim class, which is used for schema validation.
     */
    constructor(schema: string | string[], mdorim: Mdorim, data?: T | null) {
        this.mdorim = mdorim;
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
    set(data?: T | null): void {
        this.data = data;
    }

    /**
     * ## get
     * This method returns the data for the model.
     * It can return a single object, an array of objects, null, or undefined.
     *
     * @returns The data for the model. It can be a single object, an array of objects, null, or undefined.
     */
    get(): T | null | undefined {
        return this.data;
    }

    /**
     * ## checkSchemaType
     * This method checks the type of the schema property.
     * It throws an error if the schema is not a string or a Map.
     *
     * @returns "single" if the schema is a string, "multiple" if it is a Map
     * @throws MdorimError if the schema is not a string or a Map
     */
    private checkSchemaType(): "single" | "multiple" {
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
    private schemaName(id?: string): string {
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
     * ██╗   ██╗ █████╗ ██╗     ██╗██████╗  █████╗ ████████╗ ██████╗ ██████╗
     * ██║   ██║██╔══██╗██║     ██║██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
     * ██║   ██║███████║██║     ██║██║  ██║███████║   ██║   ██║   ██║██████╔╝
     * ╚██╗ ██╔╝██╔══██║██║     ██║██║  ██║██╔══██║   ██║   ██║   ██║██╔══██╗
     *  ╚████╔╝ ██║  ██║███████╗██║██████╔╝██║  ██║   ██║   ╚██████╔╝██║  ██║
     *   ╚═══╝  ╚═╝  ╚═╝╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
     */
    async validate(data: unknown, schema: string): Promise<boolean> {
        try {
            const isValid = await this.mdorim.validate(schema, data);
            if (isMdorimError(isValid)) {
                throw isValid;
            }
            return isValid;
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * Validates the entity against the schema.
     * This method should be used to validate the entity before saving it to the database.
     * For example, it can be used to validate the User entity before creating or updating it.
     *
     * @param data - Entity to validate
     * @returns true if the entity is valid, throws an MdorimError if it is not
     * @throws MdorimError
     */
    async validateEntity(
        data: Record<string, unknown>,
        schemaName?: string,
    ): Promise<boolean> {
        try {
            return this.validate(data as T, this.schemaName(schemaName));
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * Validates the ID against the UUID schema.
     * This method should be used to validate the ID before using it in a query.
     * For example, it can be used to validate the User ID before getting or deleting it.
     *
     * @param id - ID to validate
     * @returns true if the ID is valid, throws an MdorimError if it is not or
     *          if the schema for UUID is not found
     * @throws MdorimError
     */
    async validateUUID(id: unknown) {
        try {
            return this.validate(id, "/core/Definitions#/$defs/uuid");
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * Validates the email against the email schema.
     * This method should be used to validate the email before using it in a query.
     * For example, it can be used to validate the User email before getting or deleting it.
     *
     * @param email - Email to validate
     * @returns true if the email is valid, throws an MdorimError if it is not
     *          or if the schema for email is not found
     * @throws MdorimError
     */
    async validateEmail(email: unknown) {
        try {
            return this.validate(email, "/core/Definitions#/$defs/email");
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * Validates the label against the label schema.
     * This method should be used to validate the label before using it in a query.
     *
     * @param label - Label to validate
     * @returns Promise that resolves to true if the label is valid,
     *          throws an MdorimError if it is not valid or if the schema for label is not found
     * @throws MdorimError
     */
    async validateLabel(label: unknown) {
        try {
            return this.validate(label, "/linked-art/Core#/$defs/labelProp");
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * Validates the number against the number schema.
     * This method should be used to validate the number before using it in a query.
     * For example, it can be used to validate the pagination properties before getting a list of entities.
     *
     * @param number - Number to validate
     * @param acceptUndefined - If true, the method will validate undefined as a valid number
     * @returns true if the number is valid, throws an MdorimError if it is not
     *          or if the schema for number is not found
     * @throws MdorimError
     */
    async validateNumber(number: unknown, acceptUndefined?: boolean) {
        try {
            if (typeof number === "undefined" && acceptUndefined) {
                return Promise.resolve(true);
            }
            if (typeof number !== "number") {
                number = Number(number);
            }
            return this.validate(number, "/core/Definitions#/$defs/number");
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
     * @returns MdorimError or ServiceError
     */
    error(error: unknown) {
        if (isMdorimError(error)) {
            return error as MdorimError;
        }
        console.log("Error in model:", error);
        return new Error(error);
    }
}
