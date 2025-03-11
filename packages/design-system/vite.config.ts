import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import pkg from "./package.json";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        sourcemap: true,
        emptyOutDir: false,
        lib: {
            entry: path.resolve(__dirname, "lib", "index.ts"),
            name: "designSystem",
        },
        rollupOptions: {
            external: [
                ...Object.keys(pkg.peerDependencies || {}),
                ...Object.keys(pkg.devDependencies || {}),
            ],
            output: {
                // Provide global variables to use in the UMD build for externalized deps
                // https://rollupjs.org/guide/en/#output-globals-g-globals
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
    },
    plugins: [
        react(),
        tsconfigPaths(),
        dts({
            include: ["lib"],
            outDir: "dist/types",
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "lib"),
            "@/assets": path.resolve(__dirname, "assets"),
        },
    },
});
