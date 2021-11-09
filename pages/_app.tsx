import Head from 'next/head'
import type { AppProps } from 'next/app'
import { NextSeo } from 'next-seo';
import {WalletProvider} from 'context/wallet'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
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
