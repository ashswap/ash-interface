import { TransactionsTracker } from "@elrondnetwork/dapp-core/components/TransactionsTracker";
import { useGetPendingTransactions } from "@elrondnetwork/dapp-core/hooks";
import { checkBatch } from "@elrondnetwork/dapp-core/hooks/transactions/useCheckTransactionStatus/checkBatch";
import { SignedTransactionsBodyType } from "@elrondnetwork/dapp-core/types";
import {
    getIsTransactionPending
} from "@elrondnetwork/dapp-core/utils";
import { CustomComponentsType } from "@elrondnetwork/dapp-core/wrappers/DappProvider/CustomComponents";
import { lastCompletedTxHashAtom } from "atoms/transactions";
import { useEffect, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";

const CustomTransactionsTracker: typeof TransactionsTracker = () => {
    const { pendingTransactionsArray } = useGetPendingTransactions();
    const lastCompletedTxHash = useRecoilValue(lastCompletedTxHashAtom);
    const intervalRef = useRef<Record<string, any>>({});
    const timeoutRef = useRef<Record<string, any>>({});
    const pendingBatchTxsRef = useRef<[string, SignedTransactionsBodyType][]>([]);

    const pendingBatches = useMemo(() => {
        return pendingTransactionsArray.filter(
            ([sessionId, transactionBatch]) => {
                const isPending =
                    sessionId != null &&
                    getIsTransactionPending(transactionBatch.status);
                return isPending;
            }
        );
    }, [pendingTransactionsArray]);

    useEffect(() => {
        pendingBatchTxsRef.current = pendingBatches || [];
    }, [pendingBatches])

    useEffect(() => {
        if(!lastCompletedTxHash) return;
        pendingBatchTxsRef.current.map(
            ([sessionId, batch]: [string, SignedTransactionsBodyType]) => {
                const matchedTx = batch.transactions?.find(
                    (tx) => tx.hash === lastCompletedTxHash
                );
                if (matchedTx?.hash) {
                    checkBatch({
                        sessionId,
                        transactionBatch: {
                            transactions: [matchedTx],
                            customTransactionInformation: batch.customTransactionInformation
                        },
                    });
                }
            }
        );
    }, [lastCompletedTxHash]);

    // fallback if socket fail to emit/receive transactionCompleted events in 60s
    useEffect(() => {
        pendingBatches.map(
            ([sessionId, batch]: [string, SignedTransactionsBodyType]) => {
                if (!timeoutRef.current[sessionId]) {
                    const timeout = setTimeout(() => {
                        const interval = setInterval(() => {
                            checkBatch({
                                sessionId,
                                transactionBatch: batch,
                            });
                        }, 2000);
                        if (intervalRef.current) {
                            intervalRef.current[sessionId] = interval;
                        } else {
                            intervalRef.current = { [sessionId]: interval };
                        }
                    }, 2 * 60000);
                    timeoutRef.current[sessionId] = timeout;
                }
            }
        );
        // clear timeout if transactions are marked as completed by socket
        Object.entries(timeoutRef.current).map(([sessionId, timeout]) => {
            const stillPending = !!pendingBatches.find(
                ([id, batch]) => id === sessionId
            );
            if (!stillPending) {
                clearTimeout(timeout);
                delete timeoutRef.current[sessionId];
            }
        });
        // also clear the interval if any got triggered
        Object.entries(intervalRef.current).map(([sessionId, interval]) => {
            const stillPending = !!pendingBatches.find(
                ([id, batch]) => id === sessionId
            );
            if (!stillPending) {
                clearInterval(interval);
                delete intervalRef.current[sessionId];
            }
        });

    }, [pendingBatches]);

    return null;
};

export const customComponents: CustomComponentsType = {
    transactionTracker: {
        component: CustomTransactionsTracker,
    },
};
