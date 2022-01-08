const plugin = require('tailwindcss/plugin')
const clipCornerPlugin = plugin(function ({ matchUtilities, theme, addUtilities }) {
    matchUtilities(
        {
            'clip-corner': (value) => ({
                '--tw-clip-corner-size': value
            }),

        },
        { values: theme('clipCornerSize') }
    );
    addUtilities({
        '.clip-corner-br': {
            '-webkit-clip-path': theme('clipCorner.br'),
            'clip-path': theme('clipCorner.br')
        },
        '.clip-corner-bl': {
            '-webkit-clip-path': theme('clipCorner.bl'),
            'clip-path': theme('clipCorner.bl')
        },
        '.clip-corner-tr': {
            '-webkit-clip-path': theme('clipCorner.tr'),
            'clip-path': theme('clipCorner.tr')
        },
        '.clip-corner-tl': {
            '-webkit-clip-path': theme('clipCorner.tl'),
            'clip-path': theme('clipCorner.tl')
        }
    })
}, {
    theme: {
        clipCornerSize: {
            1: '0.25rem',
            2: '0.5rem',
            3: '0.75rem',
            4: '1rem'
        },
        clipCorner: {
            br: `polygon(
                0 0,
                100% 0,
                100% calc(100% - var(--tw-clip-corner-size, 0px)),
                calc(100% - var(--tw-clip-corner-size, 0px))
                    calc(100% - var(--tw-clip-corner-size, 0px)),
                calc(100% - var(--tw-clip-corner-size, 0px)) 100%,
                0% 100%
            )`,
            bl: `polygon(
                0 calc(100% - var(--tw-clip-corner-size, 0px)),
                0 0,
                100% 0,
                100% 100%,
                var(--tw-clip-corner-size, 0px) 100%,
                var(--tw-clip-corner-size, 0px)
                    calc(100% - var(--tw-clip-corner-size, 0px))
            )`,
            tr: `polygon(
                0 0,
                calc(100% - var(--tw-clip-corner-size, 0px)) 0,
                calc(100% - var(--tw-clip-corner-size, 0px))
                    var(--tw-clip-corner-size, 0px),
                100% var(--tw-clip-corner-size, 0px),
                100% 100%,
                0% 100%
            )`,
            tl: `polygon(
                0 var(--tw-clip-corner-size, 0px),
                var(--tw-clip-corner-size, 0px) var(--tw-clip-corner-size, 0px),
                var(--tw-clip-corner-size, 0px) 0,
                100% 0,
                100% 100%,
                0% 100%
            )`
        }
    }
})

module.exports = clipCornerPlugin;