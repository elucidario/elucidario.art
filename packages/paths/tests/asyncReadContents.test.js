import { asyncReadContents } from "../dist/mjs";
import path from "path";

describe("asyncReadContents", () => {
    it("should return an Array of File object from index (default)", async () => {
        const contents = await asyncReadContents({
            dirPath: "tests/data",
        });

        expect(contents).toHaveLength(2);

        expect(contents[0]).toMatchObject({
            name: "hello-world",
            path: path.resolve("tests/data/hello-world.md"),
            ext: "md",
            value: "hello world\r\n",
        });
    });

    it("should return an Array of File object without index", async () => {
        const contents = await asyncReadContents({
            dirPath: "tests/data",
            index: false,
        });
        expect(contents).toHaveLength(6);
    });
});
