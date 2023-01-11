import BasicLayout from "components/Layout/Basic";
import { SwapProvider } from 'context/swap';
import type { NextPage } from 'next';
import LedgerContainer from 'views/ledger/LedgerContainer';

const Ledger: NextPage = () => {
    return (
        <BasicLayout>
            <SwapProvider>
                <LedgerContainer/>
            </SwapProvider>
        </BasicLayout>
    )
}

export default Ledger
