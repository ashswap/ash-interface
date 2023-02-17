import { TransactionDecoder } from "@elrondnetwork/transaction-decoder";
import { atomQuestUserStats, questIsRegisteredSelector } from "atoms/ashpoint";
import { accIsLoggedInState } from "atoms/dappState";
import { lastCompletedTxHashAtom } from "atoms/transactions";
import { useSocket } from "context/socket";
import emitter from "helper/emitter";
import logApi from "helper/logHelper";
import { QuestUserStatsModel } from "interface/quest";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GetTransactionsByHashesReturnType } from "./getTransactionsByHashes";
import * as Sentry from "@sentry/nextjs";

export const TxCompletedTracker = () => {
    const { socket, socketExtra } = useSocket();
    const setUserStats = useSetRecoilState(atomQuestUserStats);
    const setLastCompletedTxHash = useSetRecoilState(lastCompletedTxHashAtom);
    const isRegistered = useRecoilValue(questIsRegisteredSelector);
    const isLoggedIn = useRecoilValue(accIsLoggedInState);
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
                if(socketExtra){
                    // socketExtra.emit("transactionCompletedClient", receiver, hash);
                }
                if (isRegistered) {
                    logApi.post("/api/v1/tracking/ash-point", {
                        action_time: Date.now(),
                        action_name: raw?.function || raw?.arguments?.functionName || raw?.action?.name,
                        action_metadata: raw,
                    }).catch((err) => {
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

    useEffect(() => {
        if(isLoggedIn){
            logApi
            .get<QuestUserStatsModel>("/api/v1/wallet")
            .then((res) => setUserStats(res.data))
            .catch((err) => Sentry.captureException(err))
        }
    }, [setUserStats, isLoggedIn]);
    return null;
};
