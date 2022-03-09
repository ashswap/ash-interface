module.exports = {
    purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./views/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class", // or "media" or "class"
    mode: "jit",
    theme: {
        extend: {
            container: {
                center: true,
                padding: "1.5rem"
            },
            spacing: {
                "5.5": "1.375rem",
            },
            fontSize: {
                "2xs": "0.625rem",
            },
            colors: {
                "bg": "#191629",
                "bg-hover": "#211D36",
                "bg-overlay": "#7B61FF",
                "ash-dark": {
                    400: "#191629",
                    500: "#212036",
                    600: "#12101D",
                    700: "#0D0B15",
                },
                "bg-select": "rgba(255, 0, 92, 0.2)",
                "bg-select-hover": "rgba(255, 0, 92, 0.4)",
                "text-input": {
                    1: "#74738e",
                    2: "#8C8A94",
                    3: "#B7B7D7",
                },
                "insufficent-fund": "#7B61FF",
                "slider": {
                    "rail": "#B7B7D7",
                    "track": "#FFC10D",
                },
                "earn": "#54C8EA",
                pink: {
                    600: "#FF005C",
                    650: "#FF015C",
                    700: "#F90060",
                    800: "#B31F54"
                },
                yellow: {
                    600: "#FFC10D",
                    700: "#E3AD12",
                },
                "ash-gray": {
                    500: "#B7B7D7"
                },
                "ash-green": {
                    500: "#00FF75"
                },
                "ash-purple": {
                    500: "#7B61FF"
                },
                "ash-blue": {
                    500: "#2175FF"
                }
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('./tailwindPlugins/clip-corner')],
}
