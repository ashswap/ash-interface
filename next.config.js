/** @type {import('next').NextConfig} */
const withFonts = require("next-fonts");
const withReactSvg = require("next-react-svg");
const path = require("path");
const withTM = require("next-transpile-modules")([
    "@elrondnetwork/dapp-core",
    "react-redux",
]);

const { withSentryConfig } = require("@sentry/nextjs");
/** @type {import('next').NextConfig} */
const config = {
    include: path.resolve(__dirname, "assets/svg"),
    reactStrictMode: true,
    // i18n: {
    //     locales: ["en"],
    //     defaultLocale: "en",
    // },
    images: {
        loader: "custom",
    },
    trailingSlash: true,
    async redirects() {
        return [
            { source: "/stake", destination: "/", permanent: false },
            { source: "/stake/mint", destination: "/", permanent: false },
        ];
    },
    sentry: {
        hideSourceMaps: true,
        disableServerWebpackPlugin: process.env.BUILD_ENV !== "prod",
        disableClientWebpackPlugin: process.env.BUILD_ENV !== "prod",
    },
    exportPathMap: async function (
        defaultPathMap,
        { dev, dir, outDir, distDir, buildId }
    ) {
        const whitelistPath = ["/", "/reward-pool"];
        const entries = Object.entries(defaultPathMap).map(
            ([path, pageObj]) => {
                return [
                    path,
                    {
                        ...pageObj,
                        page: whitelistPath.includes(pageObj.page)
                            ? pageObj.page
                            : "/404",
                    },
                ];
            }
        );
        const pathMap = Object.fromEntries(entries);
        return pathMap;
    },
};
const moduleExports = withReactSvg(withFonts(config));

const moduleWithTM = withTM(moduleExports);

const sentryWebpackPluginOptions =
    process.env.BUILD_ENV === "prod"
        ? {
              // Additional config options for the Sentry Webpack plugin. Keep in mind that
              // the following options are set automatically, and overriding them is not
              // recommended:
              //   release, url, org, project, authToken, configFile, stripPrefix,
              //   urlPrefix, include, ignore
              silent: false, // Logging when deploying to check if there is any problem
              validate: true,
              // For all available options, see:
              // https://github.com/getsentry/sentry-webpack-plugin#options.
          }
        : {
              silent: true, // Suppresses all logs
              dryRun: !process.env.SENTRY_AUTH_TOKEN,
          };

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleWithTM, sentryWebpackPluginOptions);

// https://github.com/facebookexperimental/Recoil/issues/733
// safely ignore recoil warning messages in dev (triggered by HMR)
function interceptStdout(text) {
    if (text.includes("Duplicate atom key")) {
        return "";
    }
    return text;
}

if (process.env.NODE_ENV === "development") {
    require("intercept-stdout")(interceptStdout);
}
