export class ModelError extends Error {
    constructor(
        public message: string,
        public statusCode?: number,
        public details?: Record<string, unknown>,
    ) {
        super(message);
        this.name = "ModelError";
        this.statusCode = statusCode;
        this.details = details || {};
    }
}
