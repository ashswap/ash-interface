import { DappProvider } from "@multiversx/sdk-dapp/wrappers";
import ConnectWalletModal from "components/ConnectWalletModal";
import { customComponents } from "components/DappCoreCustom";
import { TxCompletedTracker } from "components/DappCoreCustom/TxCompletedTracker";
import ErrorBoundary from "components/ErrorBoundary";
import GlowingButton from "components/GlowingButton";
import SignTxNotification from "components/SignTxNotification";
import SignTxsModal from "components/SignTxsModal";
import TxsToastList from "components/TxsToastList";
import ClientOnly from "components/Utils/ClientOnly";
import { DAPP_CONFIG } from "const/dappConfig";
import { ENVIRONMENT } from "const/env";
import { SocketProvider } from "context/socket";
import useAshpoint from "hooks/useAshpoint";
import { useRecoilAdapter } from "hooks/useRecoilAdapter/useRecoilAdapter";
import useSDKAdapter from "hooks/useRecoilAdapter/useSDKAdapter";
import { useRefreshAfterTxCompleted } from "hooks/useRefreshAfterTxCompleted";
import useSentryUser from "hooks/useSentryUser";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import {
    Fragment,
    ReactElement,
    ReactNode,
    useEffect,
    useMemo,
    useState,
} from "react";
import { RecoilRoot } from "recoil";
import { theme } from "tailwind.config";
import GlobalModals from "views/components/GlobalModal";
import * as gtag from "../helper/gtag";
import "../styles/globals.css";
import { SWRConfig } from "swr";

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};
const ProductionErrorBoundary =
    process.env.NODE_ENV === "production" ? ErrorBoundary : Fragment;
// const ProductionErrorBoundary = ErrorBoundary;
const GlobalHooks = () => {
    // setup recoil
    useRecoilAdapter();
    useSentryUser();
    useRefreshAfterTxCompleted();
    useAshpoint();
    return null;
};
const SdkDappAdapter = () => {
    useSDKAdapter();
    return null;
};
const TestnetGuard = ({ children }: any) => {
    const [pass, setPass] = useState("");
    const [inputPass, setInputPass] = useState("");
    const authorized = useMemo(() => {
        return pass === ENVIRONMENT.TESTNET_PASS;
    }, [pass]);
    useEffect(() => {
        setPass(localStorage.getItem("testnet_pass") || "");
    }, []);
    useEffect(() => {
        localStorage.setItem("testnet_pass", pass);
    }, [pass]);
    if (
        ENVIRONMENT.TESTNET_PASS &&
        process.env.NODE_ENV === "production" &&
        !authorized
    )
        return (
            <div className="w-screen h-screen bg-ash-dark-600 flex flex-col items-center justify-center px-6 text-center">
                <div className="text-3xl text-white font-bold mb-20">
                    Official testing version of AshSwap is in{" "}
                    <a href="https://devnet.ashswap.io">
                        <span className="text-pink-600 underline">Devnet</span>
                    </a>{" "}
                    now
                </div>
                <input
                    type="password"
                    className="bg-stake-dark-400 h-12 px-6 text-sm mb-10"
                    value={inputPass}
                    onChange={(e) => setInputPass(e.target.value)}
                    onKeyUp={(e) => e.key === "Enter" && setPass(inputPass)}
                />
                <button
                    className="h-12 px-6 flex items-center text-white bg-pink-600 font-bold"
                    onClick={() => setPass(inputPass)}
                >
                    Enter
                </button>
                {pass !== "" && pass !== ENVIRONMENT.TESTNET_PASS && (
                    <div className="text-sm mt-4">Incorrect password</div>
                )}
            </div>
        );
    return <>{children}</>;
};
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const router = useRouter();
    const getLayout = Component.getLayout ?? ((page) => page);

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            gtag.pageview(url);
        };

        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router.events]);
    return (
        <>
            {/* Global Site Tag (gtag.js) - Google Analytics */}
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gtag.GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                    });
                `,
                }}
            />
            <Script src="https://static.geetest.com/v4/gt4.js" />
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="theme-color" content={theme.extend.colors.bg} />
            </Head>
            <Script id="google-tag-manager" strategy="afterInteractive">
                {`
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER}');
                `}
            </Script>
            <NextSeo
                title="AshSwap DEX"
                description="As the first Stable-swap DEX to become a DeFi Layer on MultiversX, AshSwap provides a new approach to liquidity pool design to enhance yields and reduce slippage."
                openGraph={{
                    type: "website",
                    images: [{ url: "/images/og-logo.png" }],
                }}
                twitter={{
                    cardType: "summary",
                    site: "@ash_swap",
                }}
            />

            <RecoilRoot>
                <DappProvider
                    environment={ENVIRONMENT.NETWORK}
                    customNetworkConfig={DAPP_CONFIG}
                    customComponents={customComponents}
                    dappConfig={{ shouldUseWebViewProvider: true }}
                    // completedTransactionsDelay={500}
                >
                    <SWRConfig value={{ keepPreviousData: true }}>
                        <SdkDappAdapter />
                        <div className="fixed bottom-14 left-6 right-6 sm:bottom-12 sm:left-auto sm:right-12 z-toast flex flex-col items-end sm:max-w-[480px] space-y-2 sm:space-y-4">
                            <SignTxNotification />
                            <SignTxsModal />
                            <div className="absolute top-0 right-0 -translate-y-full pb-4 sm:pb-8">
                                <TxsToastList />
                            </div>
                        </div>
                        <TestnetGuard>
                            <ProductionErrorBoundary>
                                {getLayout(<Component {...pageProps} />)}
                                <ConnectWalletModal />
                            </ProductionErrorBoundary>
                            <ClientOnly>
                                <GlobalHooks />
                                <SocketProvider>
                                    <TxCompletedTracker />
                                </SocketProvider>
                                <GlobalModals />
                            </ClientOnly>
                            <div className="hidden sm:flex sm:flex-col fixed bottom-20 left-6 gap-4 text-center z-10">
                                <a
                                    href="https://event.ashswap.io"
                                    rel="noreferrer"
                                    target="_blank"
                                    className="block"
                                >
                                    <GlowingButton
                                        theme="green"
                                        className="w-full bg-stake-green-500 backdrop-blur-[25px] px-4 py-3"
                                    >
                                        <span className="text-xs font-bold text-ash-dark-400">
                                            Event
                                        </span>
                                    </GlowingButton>
                                </a>
                                <a
                                    href="https://forms.gle/VfEEfzTG3LnJPPxC9"
                                    rel="noreferrer"
                                    target="_blank"
                                    className="bg-ash-dark-600 backdrop-blur-[25px] px-4 py-3"
                                >
                                    <span className="text-xs font-bold text-white">
                                        Support Ticket
                                    </span>
                                </a>
                            </div>
                        </TestnetGuard>
                    </SWRConfig>
                </DappProvider>
            </RecoilRoot>
        </>
    );
}

export default MyApp;
