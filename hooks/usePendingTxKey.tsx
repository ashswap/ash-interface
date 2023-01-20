import { useGetPendingTransactions } from "@elrondnetwork/dapp-core/hooks";
import { useMemo } from "react";
import { useDebounce } from "use-debounce";

const usePendingTxKey = () => {
    const pendingTransactionsFromStore =
    useGetPendingTransactions().pendingTransactions;
    const pendingTxKey = useMemo(() => {
        return Object.keys(pendingTransactionsFromStore).join("-");
    }, [pendingTransactionsFromStore]);
    const [debounceKey] = useDebounce(pendingTxKey, 500);
    return debounceKey;
}

export default usePendingTxKey;