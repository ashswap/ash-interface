/** @type {import('next').NextConfig} */
const withFonts = require('next-fonts');
const withReactSvg = require('next-react-svg')
const path = require('path')

module.exports = withReactSvg(withFonts({
    include: path.resolve(__dirname, 'assets/svg'),
    reactStrictMode: true,
}))