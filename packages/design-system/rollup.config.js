import lcdrRollup from "@elucidario/tool-rollup";
import postcss from "rollup-plugin-postcss";
import tailwindcss from "@tailwindcss/postcss";

import pkg from "./package.json" with { type: "json" };

const external = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
    "react",
    "react-dom",
    "react/jsx-runtime",
    "motion/react",
];

export default lcdrRollup({
    input: "lib/index.ts",
    external,
    plugins: [
        postcss({
            extract: true,
            plugins: [tailwindcss()],
        }),
    ],
    pluginsConfig: {
        typescript: {
            declaration: false,
            declarationDir: null,
        },
    },
});
