/** @type {import('next').NextConfig} */
const withFonts = require("next-fonts");
const withReactSvg = require("next-react-svg");
const path = require("path");

const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = withReactSvg(
    withFonts({
        include: path.resolve(__dirname, "assets/svg"),
        reactStrictMode: true,
        i18n: {
            locales: ["en"],
            defaultLocale: "en",
        },
        async redirects() {
            return [];
        },
    })
);

const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore

    silent: true, // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
