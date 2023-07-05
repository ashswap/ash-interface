import { GetTransactionsByHashesReturnType } from "components/DappCoreCustom/getTransactionsByHashes";
import emitter from "helper/emitter";
import { useEffect } from "react";

/**
 *
 * @param cb callback function to be executed when the transaction completed
 * @param predicate function or an object {address: functionName[]} to determine whether to execute callback
 */
const useOnTxCompleted = (
    cb: Function,
    predicate:
        | ((value: GetTransactionsByHashesReturnType) => boolean)
        | Record<string, string[]>
) => {
    useEffect(() => {
        const onCheckBatchResult = (txs: GetTransactionsByHashesReturnType) => {
            if (
                typeof predicate === "function"
                    ? predicate(txs)
                    : txs.some((tx) => {
                          if (!tx.meta) return false;
                          const { receiver, functionName } = tx.meta;
                          return (
                              receiver &&
                              functionName &&
                              predicate[receiver] &&
                              (predicate[receiver].length === 0 ||
                                  predicate[receiver].some(
                                      (fn) => fn === functionName
                                  ))
                          );
                      })
            ) {
                cb();
            }
        };
        emitter.on("onCheckBatchResult", onCheckBatchResult);
        return () => {
            emitter.off("onCheckBatchResult", onCheckBatchResult);
        };
    }, [cb, predicate]);
};

export default useOnTxCompleted;
