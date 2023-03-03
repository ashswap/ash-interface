// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
    dsn: SENTRY_DSN,
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
    environment:
        process.env.NEXT_PUBLIC_NETWORK === "mainnet"
            ? "mainnet"
            : process.env.NEXT_PUBLIC_ASH_ENV,
    // Will cause a deprecation warning, but the demise of `ignoreErrors` is still under discussion.
    // See: https://github.com/getsentry/raven-js/issues/73
    ignoreErrors: [
        // Random plugins/extensions
        "top.GLOBALS",
        // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
        "originalCreateNotification",
        "canvas.contentDocument",
        "MyApp_RemoveAllHighlights",
        "http://tt.epicplay.com",
        "Can't find variable: ZiteReader",
        "jigsaw is not defined",
        "ComboSearch is not defined",
        "http://loading.retry.widdit.com/",
        "atomicFindClose",
        // Facebook borked
        "fb_xd_fragment",
        // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
        // See http://stackoverflow.com/questions/4113268/how-to-stop-javascript-injection-from-vodafone-proxy
        "bmi_SafeAddOnload",
        "EBCallBackMessageReceived",
        // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
        "conduitPage",
        "Cannot redefine property: ethereum",
        "ResizeObserver loop limit exceeded"
    ],
    ignoreUrls: [
        // Facebook flakiness
        /graph\.facebook\.com/i,
        // Facebook blocked
        /connect\.facebook\.net\/en_US\/all\.js/i,
        // Woopra flakiness
        /eatdifferent\.com\.woopra-ns\.com/i,
        /static\.woopra\.com\/js\/woopra\.js/i,
        // Chrome extensions
        /extensions\//i,
        /^chrome:\/\//i,
        /^chrome-extension:\/\//i,
        // Other plugins
        /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
        /webappstoolbarba\.texthelp\.com\//i,
        /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
    ],
});
