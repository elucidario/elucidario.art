import lcdrRollup from "@elucidario/tool-rollup";

import pkg from "./package.json" with { type: "json" };

const external = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
];

const output = [
    {
        file: pkg.main,
        format: "es",
        sourcemap: true,
        name: "mdorim",
    },
];

const config = lcdrRollup({
    input: "./src/index.ts",
    external: [...external],
    output: [...output],
    plugins: {
        typescript: {
            declaration: false,
            declarationDir: null,
        },
    },
});

export default config;
