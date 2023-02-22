import { LoginMethodsEnum } from "@elrondnetwork/dapp-core/types";
import { getAccountProviderType } from "@elrondnetwork/dapp-core/utils";
import { TransactionDecoder } from "@elrondnetwork/transaction-decoder";
import * as Sentry from "@sentry/nextjs";
import { questIsRegisteredAtom } from "atoms/ashpoint";
import { lastCompletedTxHashAtom } from "atoms/transactions";
import { ENVIRONMENT } from "const/env";
import { useSocket } from "context/socket";
import emitter from "helper/emitter";
import logApi from "helper/logHelper";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GetTransactionsByHashesReturnType } from "./getTransactionsByHashes";

export const TxCompletedTracker = () => {
    const { socket, socketExtra } = useSocket();
    const setLastCompletedTxHash = useSetRecoilState(lastCompletedTxHashAtom);
    const isRegistered = useRecoilValue(questIsRegisteredAtom);
    useEffect(() => {
        if (!socket) return;
        const onTxCompleted = (hash: string) => {
            // delay to get reliable transaction status
            setTimeout(() => {
                setLastCompletedTxHash(hash);
            }, 500);
        };
        socket.on("transactionCompleted", onTxCompleted);
        return () => {
            socket.off("transactionCompleted", onTxCompleted);
        };
    }, [socket, setLastCompletedTxHash]);

    useEffect(() => {
        const onCheckBatchResult = (txs: GetTransactionsByHashesReturnType) => {
            const decoder = new TransactionDecoder();
            txs.map((tx) => {
                const { hash, raw } = tx;
                const { receiver } = decoder.getTransactionMetadata({
                    data: tx.data,
                    receiver: tx.receiver,
                    sender: tx.sender,
                    value: "0",
                    type: "",
                });
                if (socketExtra) {
                    // socketExtra.emit("transactionCompletedClient", receiver, hash);
                }
                const provider = getAccountProviderType();
                if (
                    isRegistered &&
                    ENVIRONMENT.ENABLE_ASHPOINT &&
                    provider !== LoginMethodsEnum.wallet
                ) {
                    logApi
                        .post("/api/v1/tracking/ash-point", {
                            action_time: Date.now(),
                            action_name:
                                raw?.function ||
                                raw?.arguments?.functionName ||
                                raw?.action?.name,
                            action_metadata: raw,
                        })
                        .catch((err) => {
                            Sentry.captureException(err);
                        });
                }
            });
        };
        emitter.on("onCheckBatchResult", onCheckBatchResult);
        return () => {
            emitter.off("onCheckBatchResult", onCheckBatchResult);
        };
    }, [socketExtra, isRegistered]);

    return null;
};
