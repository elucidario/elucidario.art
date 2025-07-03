import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        fileParallelism: false,
        globals: true,
        coverage: {
            include: ["src/**/*.ts", "src/**/*.js"],
            reporter: ["text", "json", "html"],
            exclude: [
                "**/*.test.js",
                "**/*.test.ts",
                "**/*.spec.js",
                "**/*.spec.ts",
                "**/types.ts",
            ],
            all: true,
        },
    },
});
