import { transactionServices } from "@elrondnetwork/dapp-core";
import { useEffect, useMemo } from "react";
import { useFetchBalances } from "./useFetchBalances";

export const useRefreshAfterTxCompleted = () => {
    const { failedTransactionsArray } =
        transactionServices.useGetFailedTransactions();
    const { successfulTransactionsArray } =
        transactionServices.useGetSuccessfulTransactions();
    const fetchBalances = useFetchBalances();
    const txsCount = useMemo(() => {
        return (
            failedTransactionsArray.length + successfulTransactionsArray.length
        );
    }, [failedTransactionsArray.length, successfulTransactionsArray.length]);
    useEffect(() => {
        if (txsCount > 0) {
            fetchBalances();
        }
    }, [txsCount, fetchBalances]);
};
