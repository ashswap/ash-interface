import type { NextPage } from "next";
import BasicLayout from "components/Layout/Basic";
import Swap from "views/swap/Swap";
import { SwapProvider } from "context/swap";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ENVIRONMENT } from "const/env";

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
