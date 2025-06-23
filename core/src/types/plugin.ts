export type BasePluginOptions<T extends Record<string, unknown>> = {
    prefix: string;
} & T;

export type GraphQLPluginOptions = BasePluginOptions<Record<string, unknown>>;
