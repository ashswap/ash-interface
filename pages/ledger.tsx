import BasicLayout from "components/Layout/Basic";
import LedgerContainer from "views/ledger/LedgerContainer";
import { NextPageWithLayout } from "./_app";

const LedgerPage: NextPageWithLayout = () => {
    return <LedgerContainer />;
};

LedgerPage.getLayout = function getLayout(page) {
    return <BasicLayout>{page}</BasicLayout>;
};

export default LedgerPage;
