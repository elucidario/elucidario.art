export class ValidatorError extends Error {
    constructor(
        public message: string,
        public statusCode?: number,
        public details?: Record<string, unknown>,
    ) {
        super(message);
        this.name = "ValidatorError";
        this.statusCode = statusCode;
        this.details = details || {};
    }
}
