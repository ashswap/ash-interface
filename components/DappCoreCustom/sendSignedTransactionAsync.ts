import {
    SendSignedTransactionsReturnType,
    sendSignedTransactions as defaultSendSignedTxs,
} from "@multiversx/sdk-dapp/apiCalls/transactions";

import { Transaction } from "@multiversx/sdk-core/out";
import { TransactionDecoder } from "@elrondnetwork/transaction-decoder";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
import emitter from "helper/emitter";
import { GetTransactionsByHashesReturnType } from "./getTransactionsByHashes";
export async function sendSignedTransactionsAsync(
    signedTransactions: Transaction[]
): Promise<SendSignedTransactionsReturnType> {
    const txBatchs: {
        wrap?: Transaction;
        txs?: Transaction[];
        unwrap?: Transaction;
    }[] = [];
    let index = 0;
    txBatchs[index] = {};
    const decodedTxs = signedTransactions.map((tx) => {
        const data = new TransactionDecoder().getTransactionMetadata({
            data: tx.getData().encoded(),
            receiver: tx.getReceiver().bech32(),
            sender: tx.getSender().bech32(),
            type: "",
            value: tx.getValue().toString(),
        });
        if (
            data.functionName === "wrapEgld" &&
            WRAPPED_EGLD.wegldContracts.includes(data.receiver)
        ) {
            txBatchs[index].wrap = tx;
        } else if (
            data.functionName === "unwrapEgld" &&
            WRAPPED_EGLD.wegldContracts.includes(data.receiver)
        ) {
            txBatchs[index].unwrap = tx;
            index++;
            txBatchs[index] = {};
        } else {
            txBatchs[index].txs = [...(txBatchs[index].txs || []), tx];
        }
        return data;
    });
    const results = await Promise.all(
        txBatchs.map(async ({ wrap, txs, unwrap }) => {
            const wrapHash = wrap ? [wrap.getHash().toString()] : [];
            const txsHash = txs?.map((tx) => tx.getHash().toString()) || [];
            const unwrapHash = unwrap ? [unwrap.getHash().toString()] : [];
            const allHashes = signedTransactions.map((tx) =>
                tx.getHash().toString()
            );
            let sentTxs = false;
            let sentUnwrap = false;
            if (wrap && wrapHash.length > 0) {
                await defaultSendSignedTxs([wrap]);
            } else if (txs && txs.length > 0) {
                await defaultSendSignedTxs(txs);
                sentTxs = true;
            } else if (unwrap && unwrapHash.length > 0) {
                await defaultSendSignedTxs([unwrap]);
                sentUnwrap = true;
            }
            const onCheckBatchResult = (
                batchData: GetTransactionsByHashesReturnType
            ) => {
                const batchHashes = batchData.map((data) => data.hash);
                if (
                    wrapHash.length === 0 ||
                    (wrapHash.length > 0 &&
                        batchHashes.includes(wrapHash[wrapHash.length - 1]))
                ) {
                    txs && !sentTxs && defaultSendSignedTxs(txs);
                    sentTxs = true;
                }
                if (
                    txsHash.length === 0 ||
                    (txsHash.length > 0 &&
                        batchHashes.includes(txsHash[txsHash.length - 1]))
                ) {
                    unwrap && !sentUnwrap && defaultSendSignedTxs([unwrap]);
                    sentUnwrap = true;
                }
                if (batchHashes.includes(allHashes[allHashes.length - 1])) {
                    emitter.off("onCheckBatchResult", onCheckBatchResult);
                }
            };
            emitter.on("onCheckBatchResult", onCheckBatchResult);
            return [...wrapHash, ...txsHash, ...unwrapHash];
        })
    );
    return results.reduce((sum, hashes) => [...sum, ...hashes], []);
}
