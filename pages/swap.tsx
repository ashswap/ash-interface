import BasicLayout from "components/Layout/Basic";
import { ENVIRONMENT } from "const/env";
import { SwapProvider } from "context/swap";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Swap from "views/swap/Swap";

const Home: NextPage = () => {

    const router = useRouter();
    useEffect(() => {
        if (ENVIRONMENT.NETWORK === "mainnet" && router.route === "/swap") {
            router.replace("/stake/gov");
        }
    }, [router]);
    return (
        <BasicLayout>
            <SwapProvider>
                <Swap />
            </SwapProvider>
        </BasicLayout>
    );
};

export default Home;
