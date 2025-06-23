export class GraphError extends Error {
    public details?: unknown;
    constructor(message: string, details?: unknown) {
        super(message);
        this.name = "GraphError";
        this.details = details;
    }
}
