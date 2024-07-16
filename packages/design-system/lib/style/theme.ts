import type { Config } from "tailwindcss";

export const theme: Config["theme"] = {
    screens: {
        sm: "390px",
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
            "lcdr-pink": "var(--lcdr-pink)",
            "lcdr-blue": "var(--lcdr-blue)",
        },
        gridTemplateColumns: {
            "system-lg": "24px repeat(8, 1fr) 24px",
            "system-md": "16px repeat(4, 1fr) 16px",
            "system-sm": "8px repeat(2, 1fr) 8px",
            page: "304px 1fr 200px",
        },
        gridTemplateRows: {
            "system-lg": "24px repeat(8, 1fr) 24px",
            "system-md": "16px repeat(8, 1fr) 16px",
            "system-sm": "8px repeat(8, 1fr) 8px",
            page: "80px var(--middle-height) 32px",
        },
    },
};
