module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: "media", // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                "bg": "#191629",
                "ash-dark": "#12101D",
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
