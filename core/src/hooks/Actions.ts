export type ActionCallback = (...args: unknown[]) => void;

export function addAction(
    actionName: string,
    callback: ActionCallback,
    priority: number = 10,
): void {
    Actions.getInstance().add(actionName, callback, priority);
}

export function doAction(actionName: string, ...args: unknown[]): void {
    Actions.getInstance().do(actionName, ...args);
}

export class Actions {
    private static instance: Actions;

    hooks: Map<string, { callback: ActionCallback; priority: number }[]>;

    constructor() {
        this.hooks = new Map<
            string,
            { callback: ActionCallback; priority: number }[]
        >();
    }

    static getInstance(): Actions {
        if (!Actions.instance) {
            Actions.instance = new Actions();
        }
        return Actions.instance;
    }

    /**
     * Registers a hook for a specific event.
     * @param hookName The event name to register the hook for.
     * @param callback The function to be called when the event occurs.
     * @param priority The priority of the hook. Lower numbers are executed first.
     *                 Defaults to 10 if not provided.
     */
    add(
        hookName: string,
        callback: ActionCallback,
        priority: number = 10,
    ): void {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, []);
        }

        const hooks = this.hooks.get(hookName);

        hooks!.push({ callback, priority });
        hooks!.sort((a, b) => a.priority - b.priority);
    }

    do(actionName: string, ...args: unknown[]): void {
        if (!this.hooks.has(actionName)) {
            return;
        }

        const hooks = this.hooks.get(actionName)!;

        for (const hook of hooks) {
            hook.callback(...args);
        }
    }
}
