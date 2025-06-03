import { glob } from "glob";

import { readFile } from "fs/promises";

import path from "path";

/**
 * Reads files matching a glob pattern and returns their contents.
 *
 * @returns {Promise<string[]>} - A promise that resolves to an array of file contents.
 * @throws {Error} - Throws an error if reading files fails.
 */
export async function getGraphQLSchemas(): Promise<{
    paths: string[];
    contents: string[];
}> {
    const globPattern = "./src/graphql/schema/**/*.graphql";

    try {
        const files = await glob(globPattern);
        const fileContents = await Promise.all(
            files.map(async (file) => {
                const content = await readFile(path.normalize(file), "utf-8");
                return content;
            }),
        );
        return {
            paths: files,
            contents: fileContents,
        };
    } catch (error) {
        throw new Error(
            `Error reading files by glob pattern "${globPattern}": ${error instanceof Error ? error.message : String(error)}`,
        );
    }
}
