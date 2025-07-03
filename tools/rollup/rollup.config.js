import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import { typescriptPaths } from "rollup-plugin-typescript-paths";

import { mergeWith } from "lodash-es";

const external = ["@elucidario", "lodash-es", "lodash", "tslib"];

const spreadConfig = (spread = "", config) => {
    const toSpread = spread.split(".");
    return toSpread.reduce((acc, curr) => {
        try {
            return acc[curr];
        } catch (error) {
            return undefined;
        }
    }, config);
};

const lcdrRollup = (config = null) => {
    const typescriptConfig = spreadConfig("pluginsConfig.typescript", config);
    const terserConfig = spreadConfig("pluginsConfig.terser", config);
    const terserConfigOutput = spreadConfig(
        "pluginsConfig.terser.output",
        config,
    );

    if (config.pluginsConfig) {
        delete config.pluginsConfig;
    }

    const defaultConfig = {
        input: "src/index.ts",
        output: {
            dir: "dist",
            format: "es",
            sourcemap: true,
        },
        plugins: [
            typescript({
                tsconfig: "tsconfig.json",
                ...typescriptConfig,
            }),
            typescriptPaths(),
            terser({
                ...terserConfig,
                output: {
                    comments: "all",
                    shebang: true,
                    ...terserConfigOutput,
                },
            }),
            json(),
        ],
        external,
    };

    const externals = [];
    externals.push(...defaultConfig.external);
    if (config && config.external) {
        externals.push(...config.external);
    }

    const rollup = mergeWith(
        {},
        defaultConfig,
        config,
        {
            external: (id) => externals.some((d) => id.startsWith(d)),
        },
        (objValue, srcValue) => {
            if (Array.isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        },
    );

    return rollup;
};

export default lcdrRollup;
