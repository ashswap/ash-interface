import {
    SignedTransactionsBodyType,
    SignedTransactionsType,
    useGetPendingTransactions,
    useGetSignedTransactions,
} from "@elrondnetwork/dapp-core";
import { PendingTransactionsType } from "@elrondnetwork/dapp-core/dist/apiCalls";
import {
    getToastsIdsFromStorage,
    setToastsIdsToStorage,
} from "helper/storage/session";
import React, { useCallback, useEffect, useState } from "react";
import ToastProgress from "./ToastProgress";
import TxToast from "./TxToast";

export interface Props {
    withTxNonce?: boolean;
    pendingTransactions?: SignedTransactionsType;
    signedTransactions?: SignedTransactionsType;
    successfulToastLifetime?: number;// in second
}
/**
 * listen for pending transaction list, if it is not empty open the toast
 * @returns {JSX.Element}
 */

function TxsToastList({
    withTxNonce = false,
    pendingTransactions,
    signedTransactions,
    successfulToastLifetime = 30,
}: Props) {
    const [toastsIds, setToastsIds] = useState<string[]>([]);

    const pendingTransactionsFromStore =
        useGetPendingTransactions().pendingTransactions;

    const signedTransactionsFromStore =
        useGetSignedTransactions().signedTransactions;

    const pendingTransactionsToRender: PendingTransactionsType =
        pendingTransactions || pendingTransactionsFromStore;

    const signedTransactionsToRender: SignedTransactionsType =
        signedTransactions || signedTransactionsFromStore;

    const mappedToastsList = toastsIds.map((toastId: string) => {
        const currentTx: SignedTransactionsBodyType =
            signedTransactionsToRender[toastId];
        if (
            currentTx == null ||
            currentTx?.transactions == null ||
            currentTx?.status == null
        ) {
            return null;
        }

        const { transactions, status } = currentTx;
        return (
            <div key={toastId}>
                <TxToast
                    transactions={transactions}
                    status={status}
                    toastId={toastId}
                    withTxNonce={withTxNonce}
                    lifetimeAfterSuccess={successfulToastLifetime}
                    onClose={(id) => setToastsIds(val => val.filter(x => x !== id))}
                />
            </div>
        );
    });

    const mapPendingSignedTransactions = useCallback(() => {
        setToastsIds((val) => {
            const newToasts = [...val];

            for (const sessionId in pendingTransactionsToRender) {
                const hasToast = val.includes(sessionId);

                if (!hasToast) {
                    newToasts.push(sessionId);
                }
            }
            return newToasts;
        });
    }, [pendingTransactionsToRender]);

    const fetchSessionStorageToasts = () => {
        const sessionStorageToastsIds = getToastsIdsFromStorage();

        if (sessionStorageToastsIds) {
            const newToasts = [...toastsIds, ...sessionStorageToastsIds];
            setToastsIds(newToasts);
        }
    };

    const saveSessionStorageToasts = () => {
        const shouldSaveLocalToasts = Boolean(toastsIds.length);
        if (!shouldSaveLocalToasts) {
            return;
        }

        setToastsIdsToStorage(toastsIds);
    };

    useEffect(() => {
        fetchSessionStorageToasts();
        return () => {
            saveSessionStorageToasts();
        };
    }, []);

    useEffect(() => {
        mapPendingSignedTransactions();
    }, [mapPendingSignedTransactions]);

    return <div className="fixed bottom-10 right-10">{mappedToastsList}</div>;
}

export default TxsToastList;
