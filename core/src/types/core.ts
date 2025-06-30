import { Actions, Filters } from "@/hooks";

export type Hooks = {
    filters: Filters;
    actions: Actions;
};

export type FilterCallback<T> = (value: T, ...args: unknown[]) => unknown;

export type ActionCallback = (...args: unknown[]) => void;
