import { describe, expect, it } from "vitest";
import { getFilesByGlob } from "@/utils";

describe("getFilesByGlob", () => {
    it("should read files matching the glob pattern and return their contents", async () => {
        const { paths, contents } = await getFilesByGlob(
            "./src/utils/test-files/*.txt",
        );

        expect(paths).toBeInstanceOf(Array);
        expect(contents).toBeInstanceOf(Array);
        expect(paths.length).toBeGreaterThan(0);
        expect(contents.length).toBeGreaterThan(0);
        expect(contents[0]).toContain("This is a test file");
    });

    it("should throw an error if the glob pattern does not match any files", async () => {
        await expect(
            getFilesByGlob("./src/utils/test-files/nonexistent/*.txt"),
        ).rejects.toThrow(/Error reading files by glob pattern/);
    });
});
