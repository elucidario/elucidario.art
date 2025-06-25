import { ActionCallback } from "@/types";

/**
 * # Actions Class
 * This class manages hooks for various actions in the application.
 * It allows you to register callbacks for specific events and execute them in order of priority.
 */
export class Actions {
    /**
     * A map that holds hooks for different action names.
     */
    hooks: Map<string, { callback: ActionCallback; priority: number }[]>;

    /**
     * ## Initializes the Actions class with an empty hooks map.
     */
    constructor() {
        this.hooks = new Map<
            string,
            { callback: ActionCallback; priority: number }[]
        >();
    }

    /**
     * ## Registers a hook for a specific event.
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

    /**
     * ## Executes all hooks registered for a specific action name.
     * @param actionName The name of the action to execute hooks for.
     * @param args The arguments to pass to the hook callbacks.
     */
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
