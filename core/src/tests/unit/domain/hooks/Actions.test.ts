import { describe, it, expect, beforeEach, vi } from "vitest";
import { Actions } from "@/domain/hooks";
import { ActionCallback } from "@/types";

describe("Actions Class", () => {
    let actions: Actions;

    beforeEach(() => {
        actions = new Actions();
    });

    it("should initialize with an empty hooks map", () => {
        expect(actions.hooks).toBeInstanceOf(Map);
        expect(actions.hooks.size).toBe(0);
    });

    describe("add() method", () => {
        it("should add a hook for a new event name", () => {
            const callback: ActionCallback = () => {};

            actions.add("test:event", callback);

            expect(actions.hooks.has("test:event")).toBe(true);
            expect(actions.hooks.get("test:event")).toHaveLength(1);
        });

        it("should assign a default priority of 10 if not provided", () => {
            const callback: ActionCallback = () => {};

            actions.add("test:event", callback);

            const hook = actions.hooks.get("test:event")![0];

            expect(hook.priority).toBe(10);
        });

        it("should add multiple hooks and sort them by priority (lower first)", () => {
            const cb1 = vi.fn(); // Usando vi.fn() para criar callbacks espiões
            const cb2 = vi.fn();
            const cb3 = vi.fn();

            actions.add("sorted:event", cb2, 20);
            actions.add("sorted:event", cb3, 10);
            actions.add("sorted:event", cb1, 5);

            const hooks = actions.hooks.get("sorted:event")!;

            expect(hooks).toHaveLength(3);
            expect(hooks[0].priority).toBe(5); // cb1 deve ser o primeiro
            expect(hooks[1].priority).toBe(10); // cb3 deve ser o segundo
            expect(hooks[2].priority).toBe(20); // cb2 deve ser o último
        });
    });

    describe("do() method", () => {
        it("should not throw an error when calling do() on an action with no hooks", () => {
            expect(() => actions.do("nonexistent:action")).not.toThrow();
        });

        it("should execute a single hook for a given action", () => {
            const mockCallback = vi.fn();
            actions.add("execute:action", mockCallback);

            actions.do("execute:action");

            expect(mockCallback).toHaveBeenCalledTimes(1);
        });

        it("should pass arguments correctly to the hook callback", () => {
            const mockCallback = vi.fn();
            const args = ["hello", 123, { id: "test" }];
            actions.add("action:with-args", mockCallback);

            actions.do("action:with-args", ...args);

            expect(mockCallback).toHaveBeenCalledWith(...args);
        });

        it("should execute hooks in order of their priority", () => {
            const executionOrder: string[] = [];
            const cbPriority10 = () => executionOrder.push("second");
            const cbPriority20 = () => executionOrder.push("third");
            const cbPriority5 = () => executionOrder.push("first");

            actions.add("ordered:action", cbPriority10, 10);
            actions.add("ordered:action", cbPriority20, 20);
            actions.add("ordered:action", cbPriority5, 5);

            actions.do("ordered:action");

            expect(executionOrder).toEqual(["first", "second", "third"]);
        });

        it("should not execute hooks for a different action", () => {
            const mockCallback = vi.fn();
            actions.add("correct:action", mockCallback);

            actions.do("wrong:action");

            expect(mockCallback).not.toHaveBeenCalled();
        });
    });
});
