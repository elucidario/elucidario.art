function parseObjectPathParts(
    parts: string[],
    value?: string,
): unknown | Record<string, unknown> {
    const curr = parts[0];
    // match for array notation like "array[0]"
    const arrayMatch = curr.match(/(.*)\[(\d+)\]/);

    if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const index = parseInt(arrayMatch[2], 10);

        const nestedObject =
            parts.length === 1
                ? value
                : parseObjectPathParts(parts.slice(1), value);

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
    const nestedObject = parseObjectPathParts(parts, value);

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

    return parseObjectPathParts(parts, value) as Record<string, unknown>;
}
