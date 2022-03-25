import {
    Address,
    CallArguments,
    ChainID,
    GasLimit,
    GasPrice,
    Nonce,
    SmartContract,
    Transaction,
} from "@elrondnetwork/erdjs/out";
import { gasLimit, gasPrice, network } from "const/network";
import { useDappContext } from "context/dapp";
import { getLatestNonce, useGetAccount, useSetNonce } from "./accountMethods";
const emptyTx = new Transaction({
    nonce: new Nonce(0),
    receiver: new Address(),
});
// flow create TXS -> set nonce -> sign TXS -> send TXS -> update local nonce
export const useCreateTransaction = () => {
    const dapp = useDappContext();
    /** Create transaction with nonce = 0, set nonce with useSetTransactionsNonce or let useSignTransactions handle it automaticlly  */
    return async (address: Address, arg: CallArguments) => {
        if (!dapp.address || !dapp.dapp.proxy || !dapp.dapp.provider) {
            return emptyTx;
        }

        let contract = new SmartContract({
            address,
        });

        let tx = contract.call(arg);
        tx = new Transaction({
            chainID: new ChainID(network.id),
            data: tx.getData(),
            receiver: address,
            gasPrice: new GasPrice(gasPrice),
            gasLimit: new GasLimit(gasLimit),
            version: tx.getVersion(),
        });
        return tx;
    };
};

export const useSetTransactionsNonce = () => {
    const dapp = useDappContext();
    const getAcc = useGetAccount();
    /** get latest nonce and set the nonce for transaction (not update the local nonce yet) */
    return async (...txs: Transaction[]) => {
        const acc = await getAcc(dapp.address);
        const latestNonce = getLatestNonce(acc).valueOf();
        return txs.map((tx, i) => {
            tx.setNonce(new Nonce(latestNonce + i));
            return tx;
        });
    };
};

export const useSignTransaction = () => {
    const dapp = useDappContext();
    const setNonces = useSetTransactionsNonce();
    /** transaction must be singed by this method in otder to be sent by useSendTransaction or useSendMultipleTxs
     * the hook also set the nonce correctly before sign
     */
    return async (tx: Transaction) => {
        const [txWithNonce] = await setNonces(tx);
        return dapp.dapp.provider.signTransaction(txWithNonce);
    };
}

export const useSignTransactions = () => {
    const dapp = useDappContext();
    const setNonces = useSetTransactionsNonce();
    /** transaction must be singed by this method in otder to be sent by useSendTransaction or useSendMultipleTxs
     * the hook also set the nonce correctly before sign
     */
    return async (...txs: Transaction[]) => {
        const txsWithNonces = await setNonces(...txs);
        return dapp.dapp.provider.signTransactions(txsWithNonces);
    };
};

export const useSendTransaction = () => {
    const dapp = useDappContext();
    const setNonce = useSetNonce();
    /** send single transaction and increate local nonce by 1 */
    return async (tx: Transaction) => {
        const sentTx = await dapp.dapp.proxy.sendTransaction(tx);
        setNonce(tx.getNonce().increment().valueOf());
        return sentTx;
    };
};

export const useSendMultipleTxs = () => {
    const dapp = useDappContext();
    const setNonce = useSetNonce();
    /** send multiple transaction and update the local nonce after all sent */
    return async (txs: Transaction[]) => {
        const sentTxs: Record<number, string> =
            await dapp.dapp.proxy.doPostGeneric(
                `transaction/send-multiple`,
                txs.map((tx) => tx.toPlainObject()),
                (res) => res?.txsHashes || {}
            );
        setNonce(txs[txs.length - 1].getNonce().increment().valueOf());
        return sentTxs;
    };
};
