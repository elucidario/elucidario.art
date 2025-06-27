import { UUID } from "@elucidario/mdorim";

export type ListQueryStrings = {
    Querystring: {
        limit?: number;
        offset?: number;
        sort?: string;
        filter?: string;
    };
};

export type Params<T> = {
    Params: T;
};

export type Body<T> = {
    Body: T;
};

export type ReferenceParams = {
    referenceUUID: UUID;
    workspaceUUID: UUID;
};
