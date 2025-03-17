import ssr from "vike/plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    base: "/",
    server: {
        host: "0.0.0.0",
        port: 4000,
    },
    preview: {
        host: "0.0.0.0",
        port: 4001,
    },
    plugins: [react({}), ssr({}), tailwindcss(), tsconfigPaths()],
});
