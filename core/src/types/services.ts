import { UUID } from "@elucidario/mdorim";

export type ListParams = {
    limit?: number;
    offset?: number;
    sort?: string;
    filter?: string;
    type?: string;
};

export type QueryStrings<
    T extends Record<string, unknown> = Record<string, unknown>,
> = {
    Querystring: ListParams & T;
};

export type Params<
    T extends Record<string, unknown> = Record<string, unknown>,
> = {
    Params: T;
};

export type ParamsWithWorkspace<
    T extends Record<string, unknown> = Record<string, unknown>,
> = Params<{ workspaceUUID?: UUID } & T>;

export type Body<T> = {
    Body: T;
};

export type ReferenceParams = {
    referenceUUID: UUID;
    workspaceUUID: UUID;
};
