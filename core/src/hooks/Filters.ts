export type FilterCallback<T> = (value: T, ...args: unknown[]) => unknown;

export function addFilter<T>(
    filterName: string,
    callback: FilterCallback<T>,
    priority: number = 10,
): void {
    Filters.getInstance().add(filterName, callback, priority);
}

export function applyFilter<T>(
    filterName: string,
    value: T,
    ...args: unknown[]
): T {
    return Filters.getInstance().apply(filterName, value, ...args);
}

export class Filters {
    private static instance: Filters;

    hooks: Map<
        string,
        { callback: FilterCallback<unknown>; priority: number }[]
    >;

    static getInstance(): Filters {
        if (!Filters.instance) {
            Filters.instance = new Filters();
        }
        return Filters.instance;
    }

    constructor() {
        this.hooks = new Map<
            string,
            { callback: FilterCallback<unknown>; priority: number }[]
        >();
    }

    /**
     * Registers a hook for a specific event.
     * @param hookName The event name to register the hook for.
     * @param callback The function to be called when the event occurs.
     * @param priority The priority of the hook. Lower numbers are executed first.
     *                 Defaults to 10 if not provided.
     */
    add<T>(
        hookName: string,
        callback: FilterCallback<T>,
        priority: number = 10,
    ): void {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, []);
        }

        const hooks = this.hooks.get(hookName);

        hooks!.push({
            callback: callback as FilterCallback<unknown>,
            priority,
        });
        hooks!.sort((a, b) => a.priority - b.priority);
    }

    apply<T>(filterName: string, value: T, ...args: unknown[]): T {
        if (!this.hooks.has(filterName)) {
            return value;
        }

        const hooks = this.hooks.get(filterName)!;

        return hooks.reduce((acc, hook) => {
            return hook.callback(acc, ...args) as T;
        }, value);
    }
}
