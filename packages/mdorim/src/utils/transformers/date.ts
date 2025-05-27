import { MdorimError } from "@/errors";

export function mdorimDateToString(date: Date): string {
    if (date instanceof Date) {
        return date.toISOString();
    }
    throw new MdorimError("Invalid date type", { type: typeof date });
}

export function mdorimStringToDate(date: string): Date {
    const parsedDate = new Date(date);
    if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
        return parsedDate;
    }
    throw new MdorimError("Invalid date type", { type: typeof date });
}
