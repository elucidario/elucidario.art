import { glob } from "glob";

import { readFile } from "fs/promises";

import path from "path";

/**
 * Reads files matching a glob pattern and returns their contents.
 *
 * @param {string} globPattern - The glob pattern to match files.
 * @returns {Promise<string[]>} - A promise that resolves to an array of file contents.
 * @throws {Error} - Throws an error if reading files fails.
 */
export async function getFilesByGlob(globPattern: string): Promise<{
    paths: string[];
    contents: string[];
}> {
    try {
        const files = await glob(globPattern);
        if (files.length === 0) {
            throw new Error(
                `No files found matching the glob pattern: "${globPattern}"`,
            );
        }
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
