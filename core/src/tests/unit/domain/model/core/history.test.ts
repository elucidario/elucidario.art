import { describe, expect, it } from "vitest";

import { History as HistoryType } from "@elucidario/mdorim";
import { History } from "@/domain/models/core";

describe("History Model", () => {
    it("should create a History instance with default values", () => {
        const user = new History();
        expect(user).toBeInstanceOf(History);
        expect(user.schema).toBe("/core/History");
    });

    it("should create a History instance with provided data", () => {
        const history: HistoryType = {
            type: "HistoryEvent",
            action: "create",
            timestamp: new Date().toISOString(),
            user: {
                type: "User",
            },
            snapshot: {},
        };
        const user = new History(history);
        expect(user).toBeInstanceOf(History);
        expect(user.schema).toBe("/core/History");
    });
});
