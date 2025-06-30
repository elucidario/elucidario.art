export type Routes<
    T extends Record<string, string | string[]> = Record<
        string,
        string | string[]
    >,
> = {
    prefix: string;
    version: string;
    path: string | string[];
    endpoints: T;
};
