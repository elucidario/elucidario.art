import { Command } from "commander";
import path from "path";
import { getPaths, readFile } from "@elucidario/pkg-paths";
import { Console } from "@elucidario/pkg-console";

import typesGen from "./typesGen.js";

const pkg = readFile(
    path.resolve(getPaths().tools, "gen", "package.json"),
).value;
const console = new Console(pkg);

const Gen = () => {
    const program = new Command();
    program.version(pkg.version);

    const types = ["pkg", "tool", "app", "types"];

    /**
     * ██╗███╗   ██╗██╗████████╗
     * ██║████╗  ██║██║╚══██╔══╝
     * ██║██╔██╗ ██║██║   ██║
     * ██║██║╚██╗██║██║   ██║
     * ██║██║ ╚████║██║   ██║
     * ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝
     */
    program
        .description("Generate a new project")
        .option("-n, --name <name>", "Project name")
        .option("-t, --type <type>", "Project type")
        .option("-d, --description <description>", "Project description")
        .option("-a, --author <author>", "Project author")
        .action((options) => {
            if (!options.name) {
                console.error("Project name is required");
                return;
            }
            if (!options.type) {
                console.error("Project type is required");
                return;
            } else if (!types.includes(options.type)) {
                console.error(
                    `Invalid project type, must be one of: ${types.join(", ")}`,
                );
                return;
            }
            console.log("Generating project...");

            switch (options.type) {
                case "pkg":
                    console.log("Generating package...");
                    break;
                case "tool":
                    console.log("Generating tool...");
                    break;
                case "app":
                    console.log("Generating app...");
                    break;
                case "types":
                    typesGen(options, console);
                    break;
            }
        });

    program.parse(process.argv);
};

export default Gen;
