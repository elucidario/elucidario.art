import { MdorimError } from "@/errors";

export function isMdorimError(error: unknown): error is MdorimError {
    return (
        error instanceof MdorimError ||
        (typeof error === "object" &&
            error !== null &&
            "name" in error &&
            (error as MdorimError).name === "MdorimError")
    );
}

export function filterLinkedArtRequired(required: string[]): string[] {
    return required.filter((r) => ["@context", "id"].includes(r) === false);
}
