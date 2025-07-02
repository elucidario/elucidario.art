import { Actions, Filters } from "@/hooks";

export type Hooks = {
    filters: Filters;
    actions: Actions;
};

export type FilterCallback<T, U extends unknown[]> = (
    value: T,
    ...args: U
) => unknown;

export type ActionCallback = (...args: unknown[]) => void;
