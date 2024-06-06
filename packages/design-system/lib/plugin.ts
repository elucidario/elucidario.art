import plugin from 'tailwindcss/plugin'


export const designSystemPlugin = plugin(function ({ addBase, theme }) {
    // addBase({
    //     body: {
    //         backgroundColor: theme("colors.gray.900"),
    //         color: theme("colors.gray.800"),
    //     },
    // })
}, {
    theme: {
        fontFamily: {
            sans: ["Inter", "sans-serif"],
            mono: ["JetBrains Mono", "monospace"],
        },
        extend: {
            colors: {
                dark: "#101010",
                pink: "#e82070",
                blue: "#0078c8",
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ]
})
