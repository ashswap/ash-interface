import { TransactionsTracker } from "@elrondnetwork/dapp-core/components/TransactionsTracker";
import { useGetPendingTransactions } from "@elrondnetwork/dapp-core/hooks";
import {checkBatch} from "@elrondnetwork/dapp-core/hooks/transactions/useCheckTransactionStatus/checkBatch";
import { SignedTransactionsBodyType } from "@elrondnetwork/dapp-core/types";
import {
    getIsTransactionPending
} from "@elrondnetwork/dapp-core/utils";
import { CustomComponentsType } from "@elrondnetwork/dapp-core/wrappers/DappProvider/CustomComponents";
import { completedTxsAtom } from "atoms/transactions";
import { useEffect, useMemo, useRef } from "react";
import { useRecoilState } from "recoil";

const CustomTransactionsTracker: typeof TransactionsTracker = () => {
    const { pendingTransactionsArray } = useGetPendingTransactions();
    const [completedTxs, setCompletedTxs] = useRecoilState(completedTxsAtom);
    const intervalRef = useRef<Record<string, any>>({});
    const timeoutRef = useRef<Record<string, any>>({});

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

    const pendingLength = useMemo(
        () => pendingBatches.length,
        [pendingBatches]
    );

    useEffect(() => {
        if (pendingLength === 0) {
            setCompletedTxs([]);
        }
    }, [pendingLength, setCompletedTxs]);

    useEffect(() => {
        completedTxs.map((hash) => {
            pendingBatches.map(
                ([sessionId, batch]: [string, SignedTransactionsBodyType]) => {
                    const needCheck = batch.transactions?.some(
                        (tx) => tx.hash === hash
                    );
                    if (needCheck) {
                        checkBatch({
                            sessionId,
                            transactionBatch: batch,
                        });
                    }
                }
            );
        });
    }, [completedTxs, pendingBatches]);

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
                    }, 60000);
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
