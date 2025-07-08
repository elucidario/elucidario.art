export class GraphError extends Error {
    public details?: unknown;
    public statusCode?: number;
    constructor(message: string, details?: unknown, statusCode?: number) {
        super(message);
        this.name = "GraphError";
        this.details = details;
        this.statusCode = statusCode;
    }
}
