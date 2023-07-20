const withFonts = require("next-fonts");
const path = require("path");
const withReactSvg = require("next-react-svg")({include: path.resolve(__dirname, "assets/svg")});

const { withSentryConfig } = require("@sentry/nextjs");
/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    // i18n: {
    //     locales: ["en"],
    //     defaultLocale: "en",
    // },
    transpilePackages: ["@multiversx/sdk-dapp"],
    images: {
        loader: "custom",
        minimumCacheTTL: 1800,
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
        const ignorePathsBase = ["/stake", "/stake/mint"];
        const ignorePaths =
            process.NEXT_PUBLIC_NETWORK !== 'mainnet' && process.env.NEXT_PUBLIC_ASH_ENV === "beta"
                ? ["/ashpoint"]
                : [];
        const entries = Object.entries(defaultPathMap)
            .map(([path, pageObj]) => {
                return [
                    path,
                    {
                        ...pageObj,
                        page: [...ignorePathsBase, ...ignorePaths].includes(
                            pageObj.page
                        )
                            ? "/404"
                            : pageObj.page,
                    },
                ];
            })
            .filter((entry) => entry[0] !== "/redirect");
        ["/launch-race", "/reward-pool"].map((pathname) =>
            entries.push([pathname, { page: "/redirect" }])
        );
        const pathMap = Object.fromEntries(entries);
        return pathMap;
    },
};

const moduleExports = withFonts(withReactSvg(config));

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
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);

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
