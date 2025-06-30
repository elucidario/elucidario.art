import { UUID } from "@elucidario/mdorim";

export type ListQueryStrings<T = Record<string, unknown>> = {
    Querystring: {
        limit?: number;
        offset?: number;
        sort?: string;
        filter?: string;
    } & T;
};

export type Params<T> = {
    Params: T;
};

export type ParamsWithWorkspace<T = unknown> = Params<
    { workspaceUUID: UUID } & T
>;

export type Body<T> = {
    Body: T;
};

export type ReferenceParams = {
    referenceUUID: UUID;
    workspaceUUID: UUID;
};
