/** @type {import('tailwindcss').Config} */

import { designSystemPlugin } from "./lib/plugin.ts";

export default {
    content: ["./index.html", "./lib/**/*.{html,ts,tsx}"],
    plugins: [designSystemPlugin],
};
