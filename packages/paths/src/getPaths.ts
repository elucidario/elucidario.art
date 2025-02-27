import fs from "fs";
import path from "path";
import type { GetPathsReturn } from "@elucidario/types-paths"

export const getPaths = (): GetPathsReturn => {
    try {
        const Path = path.parse(process.cwd());

        let root = "";

        if (Path.dir.includes("packages")) {
            root = Path.dir.split("packages")[0];
        } else if (Path.dir.includes("apps")) {
            root = Path.dir.split("apps")[0];
        } else if (Path.dir.includes("publications")) {
            root = Path.dir.split("publications")[0];
        } else if (Path.dir.includes("references")) {
            root = Path.dir.split("references")[0];
        } else if (Path.dir.includes("tools")) {
            root = Path.dir.split("tools")[0];
        } else if (Path.dir.includes("types")) {
            root = Path.dir.split("types")[0];
        } else if (Path.base === "elucidario") {
            root = path.resolve(Path.dir, Path.base);
        } else {
            throw new Error("Could not find root directory");
        }

        const paths = {
            root,
            current: process.cwd(),
            apps: path.join(root, "apps"),
            packages: path.join(root, "packages"),
            publications: path.join(root, "publications"),
            references: path.join(root, "references"),
            tools: path.join(root, "tools"),
            types: path.join(root, "types"),
            monorepo: {
                apps: fs
                    .readdirSync(path.join(root, "apps"))
                    .map((dir) => [dir, path.join(root, "apps", dir)]),
                packages: fs
                    .readdirSync(path.join(root, "packages"))
                    .map((dir) => [dir, path.join(root, "packages", dir)]),
                publications: fs
                    .readdirSync(path.join(root, "publications"))
                    .map((dir) => [dir, path.join(root, "publications", dir)]),
                tools: fs
                    .readdirSync(path.join(root, "tools"))
                    .map((dir) => [dir, path.join(root, "tools", dir)]),
                types: fs
                    .readdirSync(path.join(root, "types"))
                    .map((dir) => [dir, path.join(root, "types", dir)]),
            },
        };
        return paths as GetPathsReturn;
    } catch (error) {
        console.error(error);
        return {
            root: "",
            current: "",
            apps: "",
            packages: "",
            publications: "",
            references: "",
            tools: "",
            types: "",
            monorepo: {
                packages: [],
                apps: [],
                publications: [],
                tools: [],
                types: [],
            },
        };
    }
};
