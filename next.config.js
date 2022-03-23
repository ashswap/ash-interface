/** @type {import('next').NextConfig} */
const withFonts = require('next-fonts');
const withReactSvg = require('next-react-svg')
const path = require('path')

module.exports = withReactSvg(withFonts({
    include: path.resolve(__dirname, 'assets/svg'),
    reactStrictMode: true,
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    async redirects() {
        return [
            {
                source: '/info',
                destination: '/info/tokens',
                permanent: true,
            },
            // {
            //     source: '/stake/farms',
            //     destination: '/swap',
            //     permanent: true,
            // },
        ]
    },
}))