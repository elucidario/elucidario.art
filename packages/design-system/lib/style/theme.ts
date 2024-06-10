import type { Config } from "tailwindcss";

export const theme: Config["theme"] = {
    screens: {
        sm: "480px",
        md: "752px",
        lg: "976px",
        xl: "1440px",
    },
    fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
    },
    extend: {
        colors: {
            dark: "#101010",
            "lcdr-pink": "#e82070",
            "lcdr-blue": "#0078c8",
        },
        gridTemplateRows: {
            page: "80px var(--middle-height) 32px",
        },
        gridTemplateColumns: {
            page: "304px 1fr 200px",
        },
    },
};
