import { GetTransactionsByHashesReturnType } from "@elrondnetwork/dapp-core/types";
import { TransactionDecoder } from "@elrondnetwork/transaction-decoder";
import { lastCompletedTxHashAtom } from "atoms/transactions";
import { useSocket } from "context/socket";
import emitter from "helper/emitter";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

export const TxCompletedTracker = () => {
    const { socket, socketExtra } = useSocket();
    const setLastCompletedTxHash = useSetRecoilState(lastCompletedTxHashAtom);
    useEffect(() => {
        if (!socket) return;
        const onTxCompleted = (hash: string) => {
            setLastCompletedTxHash(hash);
        };
        socket.on("transactionCompleted", onTxCompleted);
        return () => {
            socket.off("transactionCompleted", onTxCompleted);
        };
    }, [socket, setLastCompletedTxHash]);

    useEffect(() => {
        if (!socketExtra) return;
        const decoder = new TransactionDecoder();
        const onCheckBatchResult = (txs: GetTransactionsByHashesReturnType) => {
            txs.map((tx) => {
                const { hash } = tx;
                const { receiver } = decoder.getTransactionMetadata({
                    data: tx.data,
                    receiver: tx.receiver,
                    sender: tx.sender,
                    value: "0",
                    type: "",
                });
                socketExtra.emit("transactionCompletedClient", receiver, hash);
            });
        };
        emitter.on("onCheckBatchResult", onCheckBatchResult);
        return () => {
            emitter.off("onCheckBatchResult", onCheckBatchResult);
        };
    }, [socketExtra]);
    return null;
};
