import ssr from "vike/plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: 4000,
    },
    preview: {
        host: "0.0.0.0",
        port: 4001,
    },
    plugins: [react({}), ssr({}), tailwindcss()],
    resolve: {
        alias: {
            "@": "/src",
        },
    },
    build: {
        emptyOutDir: true,
    },
});
