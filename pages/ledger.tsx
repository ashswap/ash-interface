import BasicLayout from "components/Layout/Basic";
import { SwapProvider } from "context/swap";
import LedgerContainer from "views/ledger/LedgerContainer";
import { NextPageWithLayout } from "./_app";

const LedgerPage: NextPageWithLayout = () => {
    return (
        <SwapProvider>
            <LedgerContainer />
        </SwapProvider>
    );
};

LedgerPage.getLayout = function getLayout(page) {
    return <BasicLayout>{page}</BasicLayout>;
};

export default LedgerPage;
