import { TransactionSender } from "@multiversx/sdk-dapp/components/TransactionSender";
import { TransactionsTracker } from "@multiversx/sdk-dapp/components/TransactionsTracker";
import { useGetPendingTransactions } from "@multiversx/sdk-dapp/hooks";
import { checkBatch } from "@multiversx/sdk-dapp/hooks/transactions/useCheckTransactionStatus/checkBatch";
import {
    PendingTransactionsType,
    SignedTransactionsBodyType,
} from "@multiversx/sdk-dapp/types";
import { getIsTransactionPending } from "@multiversx/sdk-dapp/utils";
import { CustomComponentsType } from "@multiversx/sdk-dapp/wrappers/DappProvider/CustomComponents";
import { lastCompletedTxHashAtom } from "atoms/transactions";
import emitter from "helper/emitter";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import { getTransactionsByHashes } from "./getTransactionsByHashes";
import { sendSignedTransactionsAsync } from "./sendSignedTransactionAsync";
import { delay } from "helper/common";
const getTransactionByHashesIntercept = async (
    pendingTxs: PendingTransactionsType
) => {
    const serverTransactions = await getTransactionsByHashes(pendingTxs);
    const completedTxs = serverTransactions.filter(
        (tx) => tx.raw && tx.status !== "pending"
    );
    emitter.emit("onCheckBatchResult", completedTxs);
    return serverTransactions;
};
export const customComponents: CustomComponentsType = {
    transactionTracker: {
        component: TransactionsTracker,
        props: {
            getTransactionsByHash: getTransactionByHashesIntercept,
        },
    },
    transactionSender: {
        component: TransactionSender,
        props: {
            sendSignedTransactionsAsync,
        },
    },
};
