import { designSystemPlugin } from "./lib/style/plugin.ts";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./lib/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
    plugins: [designSystemPlugin, require("tailwindcss-animate")],
};
