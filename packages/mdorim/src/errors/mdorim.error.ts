/**
 * MdorimError class
 * This class extends the built-in Error class and adds an errors property
 * to store validation errors.
 * @class
 * @extends Error
 * @example
 * const error = new MdorimError("Validation failed", { name: "Name is required" });
 * console.log(error.getErrors()); // { name: "Name is required" }
 */
export class MdorimError extends Error {
    public errors: Record<string, unknown>;
    public statusCode?: number;

    constructor(
        message: string,
        errors: Record<string, unknown> = {},
        statusCode?: number,
    ) {
        super(`MdorimError: ${message}`);
        this.name = "MdorimError";
        this.errors = errors;
        this.statusCode = statusCode || 400; // Default to 400 Bad Request
    }

    getErrors(): Record<string, unknown> {
        return this.errors;
    }

    addError(field: string, message: unknown): MdorimError {
        this.errors[field] = message;
        return this;
    }
}
