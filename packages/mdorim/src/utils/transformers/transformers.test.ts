import { describe, expect, it } from "vitest";

import { mdorimDateToString, mdorimStringToDate } from "./date";

describe("transformers", () => {
    describe("mdorimDateToString", () => {
        it("should convert Date object to ISO string", () => {
            const date = new Date("2023-10-01T12:00:00Z");
            const result = mdorimDateToString(date);
            expect(result).toBe(date.toISOString());
        });

        it("should throw an error for invalid date type", () => {
            const invalidDate = 12345;
            // @ts-expect-error date is not a string or Date
            expect(() => mdorimDateToString(invalidDate)).toThrowError(
                "Invalid date type",
            );
        });
    });

    describe("mdorimStringToDate", () => {
        it("should convert ISO string to Date object", () => {
            const dateString = "2023-10-01T12:00:00Z";
            const result = mdorimStringToDate(dateString);
            expect(result).toEqual(new Date(dateString));
        });

        it("should throw an error for invalid string date", () => {
            const invalidDateString = "invalid-date";
            expect(() => mdorimStringToDate(invalidDateString)).toThrowError(
                "Invalid date type",
            );
        });
    });
});
