module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {
            spacing: {
                '5.5': '1.375rem',
            },
            colors: {
                'bg': '#191629',
                'bg-overlay': '#7B61FF',
                'ash-dark': {
                    500: '#212036',
                    600: '#12101D',
                    700: '#0D0B15',
                },
                'bg-select': 'rgba(238, 54, 76, 0.2)',
                'text-input': {
                    1: '#74738e',
                    2: '#8C8A94',
                    3: '#757391',
                },
                'earn': '#54C8EA',
                pink: {
                    600: '#FF005C',
                    650: '#FF015C',
                    700: '#F90060'
                },
                yellow: {
                    600: '#FFC10D',
                }
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
