import BasicLayout from "components/Layout/Basic";
import { NextPageWithLayout } from "./_app";
import Aggregator from "views/swap/Aggregator";

const SwapPage: NextPageWithLayout = () => {
    return (
        <Aggregator />
    );
};
SwapPage.getLayout = function getLayout(page) {
    return <BasicLayout>{page}</BasicLayout>;
};
export default SwapPage;
