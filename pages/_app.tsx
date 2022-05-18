import { DappProvider, transactionServices } from "@elrondnetwork/dapp-core";
import ConnectWalletModal from "components/ConnectWalletModal";
import ErrorBoundary from "components/ErrorBoundary";
import SignTxNotification from "components/SignTxNotification";
import SignTxsModal from "components/SignTxsModal";
import TxsToastList from "components/TxsToastList";
import { DAPP_CONFIG } from "const/dappConfig";
import { ENVIRONMENT } from "const/env";
import { ContractsProvider } from "context/contracts";
import { useWallet, WalletProvider } from "context/wallet";
import useSentryUser from "hooks/useSentryUser";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { Fragment, ReactElement, ReactNode, useEffect, useMemo } from "react";
import * as gtag from "../helper/gtag";
import "../styles/globals.css";

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};
const ProductionErrorBoundary =
    process.env.NODE_ENV === "production" ? ErrorBoundary : Fragment;
// const ProductionErrorBoundary = ErrorBoundary;
const GlobalHooks = () => {
    const { failedTransactionsArray } =
        transactionServices.useGetFailedTransactions();
    const { successfulTransactionsArray } =
        transactionServices.useGetSuccessfulTransactions();
    const { fetchBalances } = useWallet();
    const txsCount = useMemo(() => {
        return (
            failedTransactionsArray.length + successfulTransactionsArray.length
        );
    }, [failedTransactionsArray.length, successfulTransactionsArray.length]);
    useEffect(() => {
        if (txsCount > 0) {
            fetchBalances();
        }
    }, [txsCount, fetchBalances]);
    useSentryUser();
    return null;
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

            <DappProvider
                environment={ENVIRONMENT.NETWORK}
                customNetworkConfig={DAPP_CONFIG}
                // completedTransactionsDelay={500}
            >
                <>
                    <WalletProvider>
                        <ContractsProvider>
                            <GlobalHooks />
                            <ProductionErrorBoundary>
                                {/* <Component {...pageProps} /> */}
                                {getLayout(<Component {...pageProps} />)}
                                <ConnectWalletModal />
                            </ProductionErrorBoundary>
                        </ContractsProvider>
                    </WalletProvider>
                    <div className="fixed bottom-24 left-6 right-6 sm:bottom-12 sm:left-auto sm:right-12 z-toast flex flex-col items-end sm:max-w-[480px] space-y-2 sm:space-y-4">
                        <SignTxNotification />
                        <SignTxsModal />
                        <div className="absolute top-0 right-0 -translate-y-full pb-4 sm:pb-8">
                            <TxsToastList />
                        </div>
                    </div>
                </>
            </DappProvider>
        </>
    );
}

export default MyApp;
