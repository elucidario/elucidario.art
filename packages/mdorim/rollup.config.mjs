import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

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
    plugins: [
        nodeResolve({ browser: true }),
        commonjs(),
        NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true,
        }),
        NodeModulesPolyfillPlugin(),
    ],
    pluginsConfig: {
        typescript: {
            tsconfig: "./tsconfig.build.json",
        },
    },
});

export default config;
