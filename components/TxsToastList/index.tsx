import {
    useGetPendingTransactions,
    useGetSignedTransactions,
} from "@multiversx/sdk-dapp/hooks";
import {
    SignedTransactionsBodyType,
    SignedTransactionsType,
} from "@multiversx/sdk-dapp/types";
import { collapseModalState } from "atoms/collapseState";
import {
    getToastsIdsFromStorage,
    setToastsIdsToStorage,
} from "helper/storage/session";

import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import TxToast from "./TxToast";

export interface Props {
    withTxNonce?: boolean;
    pendingTransactions?: SignedTransactionsType;
    signedTransactions?: SignedTransactionsType;
    successfulToastLifetime?: number; // in second
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
}: Props): JSX.Element {
    const [toastsIds, setToastsIds] = useState<string[]>([]);
    const [collapsed, setCollapsed] = useState(false);
    const [isClickedCollapse, setIsClickedCollapse] =
        useRecoilState(collapseModalState);

    const pendingTransactionsFromStore =
        useGetPendingTransactions().pendingTransactions;

    const signedTransactionsFromStore =
        useGetSignedTransactions().signedTransactions;

    const pendingTransactionsToRender: SignedTransactionsType =
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
            <TxToast
                key={toastId}
                transactions={transactions}
                status={status}
                toastId={toastId}
                withTxNonce={withTxNonce}
                lifetimeAfterSuccess={successfulToastLifetime}
                onClose={(id) =>
                    setToastsIds((val) => val.filter((x) => x !== id))
                }
                collapsed={collapsed}
                onCollapsedChange={(val) => {
                    setCollapsed(val);
                    setIsClickedCollapse(true);
                }}
            />
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        mapPendingSignedTransactions();
    }, [mapPendingSignedTransactions]);

    return (
        <div className="flex flex-col sm:items-end w-full space-y-2 sm:space-y-4">
            {mappedToastsList}
        </div>
    );
}

export default TxsToastList;
