import { defineConfig } from "vitest/config";

import tsconfigPaths from "vite-tsconfig-paths";
import dynamicImport from "vite-plugin-dynamic-import";

export default defineConfig({
    plugins: [tsconfigPaths(), dynamicImport()],
    test: {
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
