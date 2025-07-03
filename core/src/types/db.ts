import { Driver } from "neo4j-driver";

export type MapNeo4jError = {
    mdorim?: Record<
        string,
        { message: string; details?: Record<string, unknown> }
    >;
    graph?: Record<
        string,
        { message: string; details?: Record<string, unknown> }
    >;
};

export type QueryCallback<T> = (driver: Driver) => Promise<T>;

export type PropertyConstraint = {
    name: string;
    labels: string[];
    prop: string;
};
