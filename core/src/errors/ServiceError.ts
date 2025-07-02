export class ServiceError extends Error {
    constructor(
        public message: string,
        public statusCode?: number,
        public details?: Record<string, unknown>,
    ) {
        super(message);
        this.name = "ServiceError";
        this.statusCode = statusCode;
        this.details = details || {};
    }
}
