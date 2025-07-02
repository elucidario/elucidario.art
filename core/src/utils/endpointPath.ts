import { Routes } from "@/types";

export type EndpointPathParams = {
    before?: string[];
    after?: string[];
};

export function endpointPath<T extends Record<string, string | string[]>>(
    opts: Routes<T>,
    endpointKey?: keyof T,
): string {
    const subPaths: Array<string | false> = [];

    if (typeof endpointKey === "undefined") {
        subPaths.push(false);
    } else if (Array.isArray(opts.endpoints[endpointKey])) {
        subPaths.push(...opts.endpoints[endpointKey]);
    } else if (typeof opts.endpoints[endpointKey] === "string") {
        subPaths.push(opts.endpoints[endpointKey]);
    } else {
        subPaths.push(false);
    }

    const paths = [
        opts.prefix,
        opts.version,
        ...(typeof opts.path === "string" ? [opts.path] : opts.path),
        ...subPaths,
    ].filter(Boolean);

    return `/${paths.join("/")}`;
}
