import Authenticate from "components/Authenticate";
import ConnectWalletModal from "components/ConnectWalletModal";
import { DappContextProvider } from "context/dapp";
import { WalletProvider } from "context/wallet";
import { NextSeo } from "next-seo";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { ReactElement, ReactNode, useEffect } from "react";
import * as dappConfig from "../dapp-config";
import * as gtag from "../helper/gtag";
import "../styles/globals.css";

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
  }
  
  type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
  }

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const router = useRouter();
    const getLayout = Component.getLayout ?? ((page) => page)
    
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
                `
                }}
            />
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
            </Head>
            <NextSeo
                title="AshSwap Interface"
                description="Swap or provide liquidity on the AshSwap Protocol."
            />
            <DappContextProvider config={dappConfig}>
                <Authenticate>
                    <WalletProvider>
                        {/* <Component {...pageProps} /> */}
                        {getLayout(<Component {...pageProps} />)}
                        <ConnectWalletModal/>
                    </WalletProvider>
                </Authenticate>
            </DappContextProvider>
        </>
    );
}

export default MyApp;
