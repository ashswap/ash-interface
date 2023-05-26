import BasicLayout from "components/Layout/Basic";
import { SwapProvider } from "context/swap";
import { NextPageWithLayout } from "./_app";
import Aggregator from "views/swap/Aggregator";

const SwapPage: NextPageWithLayout = () => {
    return (
        <SwapProvider>
            <Aggregator />
        </SwapProvider>
    );
};
SwapPage.getLayout = function getLayout(page) {
    return <BasicLayout>{page}</BasicLayout>;
};
export default SwapPage;
