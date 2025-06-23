import lcdrRollup from "@elucidario/tool-rollup";

import pkg from "./package.json" with { type: "json" };

const external = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
];

const minified = [
    {
        file: pkg.main,
        format: "iife",
        sourcemap: true,
        globals: {
            "react-dom/client": "ReactDOM",
        },
    },
];

const unMinified = minified.map(({ file, ...rest }) => ({
    ...rest,
    file: file.replace(".min.", "."),
}));

const config = lcdrRollup({
    external: [...external, "react-dom/client"],
    input: "src/ts/index.tsx",
    output: [...unMinified, ...minified],
    plugins: {
        typescript: {
            declaration: false,
            declarationDir: null,
        },
    },
    pluginsConfig: {
        typescript: {
            tsconfig: "tsconfig.build.json",
        },
    },
});

export default config;
