import BasicLayout from "components/Layout/Basic";
import { SwapProvider } from "context/swap";
import Swap from "views/swap/Swap";
import { NextPageWithLayout } from "./_app";

const SwapPage: NextPageWithLayout = () => {
    return (
        <SwapProvider>
            <Swap />
        </SwapProvider>
    );
};
SwapPage.getLayout = function getLayout(page) {
    return <BasicLayout>{page}</BasicLayout>;
};
export default SwapPage;
