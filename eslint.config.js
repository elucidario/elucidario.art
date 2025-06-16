import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        ignores: [
            "**/dist/**",
            "**/node_modules/**",
            "**/coverage/**",
            "**/.next/**",
        ],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: { js },
        extends: ["js/recommended"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    tseslint.configs.recommended,
    {
        files: [
            "./frontend/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
            "./packages/design-system/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
        ],
        ...pluginReact.configs.flat.recommended,
        rules: {
            "react/prop-types": "off", // We use TypeScript for type checking
            "react/jsx-uses-react": "off", // Not needed with React 17+
            "react/react-in-jsx-scope": "off", // Not needed with React 17+
        },
    },
    {
        files: ["**/*.json"],
        plugins: { json },
        language: "json/json",
        extends: ["json/recommended"],
        ignores: [
            ".vscode/settings.json",
            "**/package-lock.json",
            "**/yarn.lock",
            "**/pnpm-lock.yaml",
            "**/tsconfig.*json",
        ],
    },
    {
        files: ["**/*.jsonc"],
        plugins: { json },
        language: "json/jsonc",
        extends: ["json/recommended"],
        ignores: [
            ".vscode/settings.json",
            "**/package-lock.json",
            "**/yarn.lock",
            "**/pnpm-lock.yaml",
            "**/tsconfig.*json",
        ],
    },
    {
        files: ["**/*.md"],
        plugins: { markdown },
        language: "markdown/gfm",
        extends: ["markdown/recommended"],
        ignores: [".changeset/**", ".github/**", "**/CHANGELOG.md"],
    },
]);
