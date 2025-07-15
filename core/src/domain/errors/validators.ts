import { Neo4jError } from "neo4j-driver";

import { GraphError } from "./GraphError";
import { ServiceError } from "./ServiceError";
import { QueryError } from "./QueryError";
import { ModelError } from "./ModelError";
import { ValidatorError } from "./ValidatorError";
import { ControllerError } from "./ControllerError";

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

export function isQueryError(error: unknown): error is QueryError {
    return (
        error instanceof QueryError ||
        (typeof error === "object" &&
            error !== null &&
            "name" in error &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).name === "QueryError")
    );
}

export function isModelError(error: unknown): error is ModelError {
    return (
        error instanceof ModelError ||
        (typeof error === "object" &&
            error !== null &&
            "name" in error &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).name === "ModelError")
    );
}

export function isValidatorError(error: unknown): error is ValidatorError {
    return (
        error instanceof ValidatorError ||
        (typeof error === "object" &&
            error !== null &&
            "name" in error &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).name === "ValidatorError")
    );
}

export function isControllerError(error: unknown): error is ControllerError {
    return (
        error instanceof ControllerError ||
        (typeof error === "object" &&
            error !== null &&
            "name" in error &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).name === "ControllerError")
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
