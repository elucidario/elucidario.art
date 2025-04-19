import { MdorimError } from "../mdorim.error";

export function isMdorimError(error: unknown): error is MdorimError {
    return (
        error instanceof MdorimError ||
        (typeof error === "object" &&
            error !== null &&
            "name" in error &&
            (error as MdorimError).name === "MdorimError")
    );
}

function parseObjectParts(
    parts: string[],
    value?: string,
): unknown | Record<string, unknown> {
    const curr = parts[0];
    const arrayMatch = curr.match(/(.*)\[(\d+)\]/);

    if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const index = parseInt(arrayMatch[2], 10);

        const nestedObject =
            parts.length === 1
                ? value
                : parseObjectParts(parts.slice(1), value);

        return {
            [arrayName]:
                typeof nestedObject === "string"
                    ? nestedObject
                    : Array.from({ length: index + 1 }, (_, i) => {
                          if (i === index) {
                              return nestedObject;
                          }
                          return {};
                      }),
        };
    }

    if (parts.length === 1) {
        return {
            [curr]: value,
        };
    }

    const currentPart = parts.shift() as string;
    const nestedObject = parseObjectParts(parts, value);

    return {
        [currentPart]: nestedObject,
    };
}

export function parseObjectPath(
    path: string,
    value?: string,
): Record<string, unknown> | false {
    if (!path) {
        return false;
    }

    const parts = path.split(".");

    return parseObjectParts(parts, value) as Record<string, unknown>;
}
