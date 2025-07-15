export class ControllerError extends Error {
    constructor(
        public message: string,
        public statusCode: number,
        public details?: Record<string, unknown>,
    ) {
        super(message);
        this.name = "ControllerError";
        this.statusCode = statusCode;
        this.details = details || {};
    }
}
