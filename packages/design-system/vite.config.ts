import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
    plugins: [tailwindcss(), react(), viteTsconfigPaths()],

    server: {
        port: 3000,
        host: true,
    },

    build: {
        copyPublicDir: false,
        lib: {
            entry: "./lib/index.ts",
            name: "design-system",
            fileName: (format) => `design-system.${format}.js`,
            formats: ["es", "cjs"],
        },
        rollupOptions: {
            external: [
                "react",
                "react-dom",
                "react/jsx-runtime",
                "tailwindcss",
                "zustand",
            ],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                    "react/jsx-runtime": "jsxRuntime",
                    tailwindcss: "tailwindcss",
                },
            },
        },
    },
});
