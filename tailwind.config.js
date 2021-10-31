module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: "media", // or 'media' or 'class'
    theme: {
        extend: {
            spacing: {
                "5.5": "1.375rem",
            },
            colors: {
                "bg": "#191629",
                "ash-dark": "#12101D",
                "bg-select": "rgba(238, 54, 76, 0.2)",
                "text-input": "#74738e",
                pink: {
                    700: "#F90060",
                    600: "#FF005C"
                }
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
