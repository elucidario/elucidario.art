import plugin from "tailwindcss/plugin";
import { theme } from "./theme";

export const designSystemPlugin = plugin(
    function ({ addBase, theme }) {
        // addBase({
        //     body: {
        //         backgroundColor: theme("colors.gray.900"),
        //         color: theme("colors.gray.800"),
        //     },
        // })
    },
    {
        theme,
    },
);
