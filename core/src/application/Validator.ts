import {
    isMdorimError,
    Mdorim,
    MdorimBase,
    MdorimError,
    SchemaObject,
} from "@elucidario/mdorim";

import IModel from "@/domain/models/IModel";
import { isValidatorError, ValidatorError } from "@/domain/errors";

export class Validator {
    /**
     * ## model
     * This property holds the model instance that this validator is associated with.
     * It is used to access the schema and perform validation.
     */
    model?: IModel<MdorimBase>;

    /**
     * ## mdorim
     * This property holds the instance of the Mdorim class, which is used for schema validation.
     * It is initialized in the constructor and used for validating data against the schema.
     */
    protected mdorim: Mdorim;

    /**
     * # Validator
     * This class provides methods to validate data against schemas defined in the Mdorim instance.
     * It is used to ensure that the data conforms to the expected structure before being processed or saved.
     *
     * @param mdorim - The instance of the Mdorim class, which is used for schema validation.
     * @param model - The model instance that this validator is associated with.
     */
    constructor(mdorim: Mdorim, model?: IModel<MdorimBase>) {
        this.mdorim = mdorim;
        this.model = model;
    }

    /**
     * ## Set the model for the validator.
     * This method is used to associate a model with the validator.
     * It allows the validator to access the schema and perform validation based on the model's schema.
     *
     * @param model - The model instance to set for the validator.
     */
    setModel(model: IModel<MdorimBase>) {
        this.model = model;
    }

    /**
     * Get the schema for the model.
     * @param id - ID to get the schema for (optional)
     * @returns SchemaObject for the model
     */
    getSchema(id?: string): SchemaObject {
        try {
            if (!this.model) {
                throw this.error(
                    "Model is not defined. Please set the model before getting the schema.",
                );
            }
            return this.mdorim.getSchema(this.model.schemaName(id));
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
    /**
     * Validate the data against the schema.
     * @param data - Data to validate
     * @param schema - Schema to validate against
     * @returns true if the data is valid, false otherwise
     * @throws MdorimError if the validation fails or if the schema is not found
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
     * @returns true if the entity is valid, throws an MdorimError if it is not
     * @throws MdorimError
     */
    async validateEntity(args?: {
        data?: Partial<MdorimBase>;
        schemaName?: string;
    }): Promise<boolean> {
        try {
            if (typeof this.model === "undefined") {
                throw this.error(
                    "Model is not defined. Please set the model before getting the schema.",
                );
            }
            const data: Partial<MdorimBase> | null =
                args?.data || this.model.get();
            if (!data) {
                throw this.error(
                    "Data is not set. Please set the data before validating.",
                );
            }
            const isValid = await this.validate(
                data,
                this.model.schemaName(args?.schemaName),
            );
            if (isValid) {
                this.model.set(data as MdorimBase);
            }
            return isValid;
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
     * Validates the username against the username schema.
     * This method should be used to validate the username before using it in a query.
     * For example, it can be used to validate the User username before getting or deleting it.
     *
     * @param username - Username to validate
     * @returns true if the username is valid, throws an MdorimError if it is not
     *          or if the schema for username is not found
     * @throws MdorimError
     */
    async validateUsername(username: unknown) {
        try {
            return this.validate(username, "/core/Definitions#/$defs/username");
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
    error(
        error: unknown,
        statusCode: number = 500,
    ): MdorimError | ValidatorError {
        if (isMdorimError(error)) {
            return error as MdorimError;
        }
        if (isValidatorError(error)) {
            return error as ValidatorError;
        }
        return new ValidatorError(error, statusCode);
    }
}
