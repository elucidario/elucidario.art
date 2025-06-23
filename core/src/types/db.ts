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
