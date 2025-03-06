import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        ignores: ["**/node_modules/**", "**/dist/**"],
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "@typescript-eslint": typescriptPlugin,
        },
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            ...typescriptPlugin.configs["recommended"].rules,
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
        },
    },
    {
        languageOptions: {
            globals: {
                browser: true,
                node: true,
                es6: true,
            },
        },
    },
];
