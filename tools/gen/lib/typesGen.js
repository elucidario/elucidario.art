import path from "path";

import { createDir, createFile, getPaths } from "@elucidario/pkg-paths";

import packageJsonTemplate from "./packageJsonTemplate.js";
import tsConfigTemplate from "./tsconfigTemplate.js";
import readmeTemplate from "./readmeTemplate.js";
import { installDepsDev } from "./installDeps.js";

const typesGen = async (options, console) => {
    if (options.type !== "types") {
        throw new Error("Invalid project type, must be 'types'");
    }
    const paths = getPaths();
    const typesList = paths.monorepo.types;

    const found = typesList.find(([name, path]) => name === options.name);

    if (found) {
        throw new Error(
            `Type's package named "${options.name}" already exists`,
        );
    }

    const packageJson = packageJsonTemplate(
        "types",
        options.name,
        options.description,
        options.author,
        "MIT",
    );

    createFile(
        path.resolve(paths.types, options.name, "package.json"),
        packageJson,
    );

    const tsConfig = tsConfigTemplate();

    createFile(
        path.resolve(paths.types, options.name, "tsconfig.json"),
        tsConfig,
    );

    const readme = readmeTemplate(options);

    createFile(path.resolve(paths.types, options.name, "README.md"), readme);

    console.log("Installing dependencies...");

    await installDepsDev({
        cd: path.resolve(paths.types, options.name),
        deps: ["typescript"],
        console,
    }).then(() => {
        console.log("Dependencies installed");
    });

    createDir(path.resolve(paths.types, options.name, "src"));
    createDir(path.resolve(paths.types, options.name, "dist"));

    console.log(`Type ${options.name} generated`);
};

export default typesGen;
