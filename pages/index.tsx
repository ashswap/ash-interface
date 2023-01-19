import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import BasicLayout from "components/Layout/Basic";
import MainnetLayout from "components/Layout/Mainnet";
import CountdownMainnet from "views/countdown/CountdownMainnet";

const Home: NextPage = () => {
    const router = useRouter();

    // useEffect(() => {
    //     if (router.route === "/") {
    //         router.replace("/swap")
    //     }
    // }, [router])

    return (
        <BasicLayout>
            <MainnetLayout>
                <CountdownMainnet />
            </MainnetLayout>
        </BasicLayout>
    );
};

export default Home;
