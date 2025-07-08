import { describe, it, expect, beforeEach, vi } from "vitest";
import { Filters } from "@/domain/hooks";
import { FilterCallback } from "@/types";

describe("Filters Class", { skip: false }, () => {
    let filters: Filters;

    beforeEach(() => {
        filters = new Filters();
    });

    it("should initialize with an empty hooks map", () => {
        expect(filters.hooks).toBeInstanceOf(Map);
        expect(filters.hooks.size).toBe(0);
    });

    describe("add() method", () => {
        it("should add a filter for a new event name", () => {
            const callback: FilterCallback<string, unknown[]> = (value) =>
                value;

            filters.add("test:filter", callback);

            expect(filters.hooks.has("test:filter")).toBe(true);
            expect(filters.hooks.get("test:filter")).toHaveLength(1);
        });

        it("should assign a default priority of 10 if not provided", () => {
            const callback: FilterCallback<string, unknown[]> = (value) =>
                value;

            filters.add("test:filter", callback);
            const hook = filters.hooks.get("test:filter")![0];

            expect(hook.priority).toBe(10);
        });

        it("should add multiple filters and sort them by priority (lower first)", () => {
            const cb1 = vi.fn();
            const cb2 = vi.fn();
            const cb3 = vi.fn();

            filters.add("sorted:filter", cb2, 20);
            filters.add("sorted:filter", cb3, 10);
            filters.add("sorted:filter", cb1, 5);

            const hooks = filters.hooks.get("sorted:filter")!;
            expect(hooks).toHaveLength(3);
            expect(hooks[0].priority).toBe(5);
            expect(hooks[1].priority).toBe(10);
            expect(hooks[2].priority).toBe(20);
        });
    });

    describe("apply() method", () => {
        it("should return the original value if no filters are registered", () => {
            const initialValue = "unchanged";

            const result = filters.apply("nonexistent:filter", initialValue);

            expect(result).toBe(initialValue);
        });

        it("should apply a single filter to a value", () => {
            const initialValue = "start";
            const filterCallback: FilterCallback<string, unknown[]> = (value) =>
                `${value}-filtered`;
            filters.add("single:filter", filterCallback);

            const result = filters.apply("single:filter", initialValue);

            expect(result).toBe("start-filtered");
        });

        it("should pass additional arguments to the filter callback", () => {
            const mockCallback = vi.fn((value) => value); // Precisa retornar o valor para o próximo reduce
            const initialValue = "value";
            const extraArgs = ["arg1", 123];
            filters.add("filter:with-args", mockCallback);

            filters.apply("filter:with-args", initialValue, ...extraArgs);

            expect(mockCallback).toHaveBeenCalledWith(
                initialValue,
                ...extraArgs,
            );
        });

        it("should apply filters sequentially, chaining the results in priority order", () => {
            const initialValue = "Start:";

            // Os callbacks modificarão o valor em uma sequência previsível (A, B, C)
            const filterA: FilterCallback<string, unknown[]> = (val) =>
                `${val}A`;
            const filterB: FilterCallback<string, unknown[]> = (val) =>
                `${val}B`;
            const filterC: FilterCallback<string, unknown[]> = (val) =>
                `${val}C`;

            // Adiciona em ordem de prioridade misturada
            filters.add("chain:filter", filterB, 10);
            filters.add("chain:filter", filterC, 20);
            filters.add("chain:filter", filterA, 5); // Este deve ser o primeiro a ser executado

            const result = filters.apply("chain:filter", initialValue);

            // A ordem de execução esperada é filterA (5), depois filterB (10), depois filterC (20).
            // 1. apply(filterA, 'Start:') -> 'Start:A'
            // 2. apply(filterB, 'Start:A') -> 'Start:AB'
            // 3. apply(filterC, 'Start:AB') -> 'Start:ABC'
            expect(result).toBe("Start:ABC");
        });

        it("should handle different data types correctly", () => {
            const filter1: FilterCallback<number, unknown[]> = (num) => num * 2; // 5 -> 10
            const filter2: FilterCallback<number, unknown[]> = (num) => num + 5; // 10 -> 15
            filters.add("math:filter", filter1, 10);
            filters.add("math:filter", filter2, 20);

            const result = filters.apply("math:filter", 5);

            expect(result).toBe(15);
        });
    });
});
