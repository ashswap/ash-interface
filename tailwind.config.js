const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./views/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class", // or "media" or "class"
    theme: {
        screens: {
            'xs': '475px',
            ...defaultTheme.screens,
        },
        extend: {
            container: {
                center: true,
                padding: "1.5rem"
            },
            spacing: {
                "4.5": "1.125rem",
                "5.5": "1.375rem",
                "7.5": "1.875rem",
                18: "4.5rem"
            },
            fontSize: {
                "2xs": "0.625rem",
            },
            colors: {
                "bg": "#191629",
                "bg-hover": "#211D36",
                "bg-overlay": "#7B61FF",
                "ash-dark": {
                    300: "#292540",
                    350: "#221F35",
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
                    400: "#C4C4C4",
                    500: "#B7B7B7",
                    600: "#757391"
                },
                "ash-green": {
                    500: "#00FF75"
                },
                "ash-pink": {
                    500: "#FF00E5"
                },
                "ash-purple": {
                    500: "#7B61FF"
                },
                "ash-light-blue": {
                    500: "#7FE7FF"
                },
                "ash-blue": {
                    500: "#2175FF"
                },
                "ash-steel": {
                    500: "#46ABC9"
                },
                "ash-cyan": {
                    500: "#00FFFF"
                },
                "stake-dark": {
                    300: "#31334c",
                    400: "#2B2C44",
                    450: "#28273f",
                    500: "#26253C"
                },
                "stake-green": {
                    500: "#14E499"
                },
                "stake-gray": {
                    500: "#B7B7D7"
                },
                "mvx": {
                    xportal: "#23F7DD"
                }

            },
            zIndex: {
                toast: 998,
                modal: 999,
                tooltip: 1000,
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar-hide'),
        require('./tailwindPlugins/clip-corner'),
        require('./tailwindPlugins/colored-drop-shadow'),
        require('./tailwindPlugins/border-notch'),
    ],
}
