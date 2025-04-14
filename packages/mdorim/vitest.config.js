import { defineConfig } from "vitest/config";
import externalGlobals from "rollup-plugin-external-globals";

import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        externalGlobals({
            jsonschema: "jsonschema",
        }),
    ],
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
