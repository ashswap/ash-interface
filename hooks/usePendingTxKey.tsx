import { useGetPendingTransactions } from "@elrondnetwork/dapp-core/hooks";
import { useMemo } from "react";

const usePendingTxKey = () => {
    const pendingTransactionsFromStore =
    useGetPendingTransactions().pendingTransactions;
    const pendingTxKey = useMemo(() => {
        return Object.keys(pendingTransactionsFromStore).join("-");
    }, [pendingTransactionsFromStore]);
    return pendingTxKey;
}

export default usePendingTxKey;