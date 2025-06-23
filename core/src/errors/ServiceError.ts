export class ServiceError extends Error {
    constructor(
        public message: string,
        public details?: Record<string, unknown>,
        public code?: string,
    ) {
        super(message);
        this.name = "ServiceError";
        this.details = details || {};
        this.code = code || "SERVICE_ERROR";
    }
}
