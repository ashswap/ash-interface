import BasicLayout from "components/Layout/Basic";
import { SwapProvider } from "context/swap";
import type { NextPage } from "next";
import Swap from "views/swap/Swap";

const Home: NextPage = () => {
    return (
        <BasicLayout>
            <SwapProvider>
                <Swap />
            </SwapProvider>
        </BasicLayout>
    );
};

export default Home;
