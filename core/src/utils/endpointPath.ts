export function endpointPath(...parts: string[]): string {
    const path = parts
        .filter((part) => part && part.trim() !== "")
        .map((part) => part.replace(/^\//, "").replace(/\/$/, ""))
        .join("/");
    return `/${path}`;
}
