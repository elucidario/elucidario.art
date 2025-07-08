import { FilterCallback } from "@/types";

/**
 * # Filters Class
 * This class manages hooks for various filters in the application.
 * It allows you to register callbacks for specific filter events and apply them in order of priority.
 */
export class Filters {
    /**
     * A map that holds hooks for different filter names.
     */
    hooks: Map<
        string,
        { callback: FilterCallback<unknown, unknown[]>; priority: number }[]
    >;

    /**
     * ## Initializes the Filters class with an empty hooks map.
     */
    constructor() {
        this.hooks = new Map<
            string,
            { callback: FilterCallback<unknown, unknown[]>; priority: number }[]
        >();
    }

    /**
     * Registers a hook for a specific event.
     * @param hookName The event name to register the hook for.
     * @param callback The function to be called when the event occurs.
     * @param priority The priority of the hook. Lower numbers are executed first.
     *                 - Defaults to 10 if not provided.
     */
    add<T, U extends unknown[]>(
        hookName: string,
        callback: FilterCallback<T, U>,
        priority: number = 10,
    ): void {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, []);
        }

        const hooks = this.hooks.get(hookName);

        hooks!.push({
            callback: callback as FilterCallback<unknown, unknown[]>,
            priority,
        });
        hooks!.sort((a, b) => a.priority - b.priority);
    }

    /**
     * Applies all hooks registered for a specific filter name.
     * @param filterName The name of the filter to apply hooks for.
     * @param value The initial value to be filtered.
     * @param args Additional arguments to pass to the hook callbacks.
     * @returns The filtered value after applying all hooks.
     */
    apply<T, U extends unknown[] = []>(
        filterName: string,
        value: T,
        ...args: U
    ): T {
        if (!this.hooks.has(filterName)) {
            return value;
        }

        const hooks = this.hooks.get(filterName)!;

        return hooks.reduce((acc, hook) => {
            return hook.callback(acc, ...args) as T;
        }, value);
    }
}
