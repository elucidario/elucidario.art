export class QueryError extends Error {
    public details?: unknown;
    constructor(message: string, details?: unknown) {
        super(message);
        this.name = "QueryError";
        this.details = details;
    }
}
