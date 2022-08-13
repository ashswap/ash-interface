import {
    useGetFailedTransactions,
    useGetSuccessfulTransactions
} from "@elrondnetwork/dapp-core/hooks";
import { useEffect, useState } from "react";
import { useFetchBalances } from "./useFetchBalances";

export const useRefreshAfterTxCompleted = () => {
    const { failedTransactionsArray } = useGetFailedTransactions();
    const { successfulTransactionsArray } = useGetSuccessfulTransactions();
    const fetchBalances = useFetchBalances();
    const [txsCount, setTxsCount] = useState(0);
    const [prevTxsCount, setPrevTxsCount] = useState(0);
    useEffect(() => {
        setTxsCount((count) => {
            setPrevTxsCount(count);
            return (
                failedTransactionsArray.length +
                successfulTransactionsArray.length
            );
        });
    }, [failedTransactionsArray.length, successfulTransactionsArray.length]);
    useEffect(() => {
        if (prevTxsCount > 0) {
            fetchBalances();
        }
    }, [prevTxsCount, fetchBalances]);
};
