import { useEffect } from 'react';
import Head from 'next/head'
import Script from 'next/script'
import type { AppProps } from 'next/app'
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router'
import {WalletProvider} from 'context/wallet'
import '../styles/globals.css'
import * as gtag from '../helper/gtag'

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter()
    useEffect(() => {
        const handleRouteChange = (url: string) => {
            gtag.pageview(url)
        }

        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events])

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
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <NextSeo
                title="AshSwap Interface"
                description="Swap or provide liquidity on the AshSwap Protocol."
            />
            <WalletProvider>
                <Component {...pageProps} />
            </WalletProvider>
        </>
    )
}

export default MyApp
