import { Neo4jError } from "neo4j-driver";

import { GraphError } from "./GraphError";
import { ServiceError } from "./ServiceError";

export function isGraphError(error: unknown): error is GraphError {
    return (
        error instanceof GraphError ||
        (typeof error === "object" &&
            error !== null &&
            "name" in error &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).name === "GraphError")
    );
}

export function isServiceError(error: unknown): error is ServiceError {
    return (
        error instanceof ServiceError ||
        (typeof error === "object" &&
            error !== null &&
            "name" in error &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).name === "ServiceError")
    );
}

export function isNeo4jError(error: unknown): error is Neo4jError {
    return (
        error instanceof Neo4jError ||
        (typeof error === "object" &&
            error !== null &&
            "name" in error &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).name === "Neo4jError")
    );
}
