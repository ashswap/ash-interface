import axios from "axios";
import { apiAddressSelector } from "@multiversx/sdk-dapp/reduxStore/selectors";
import { store } from "@multiversx/sdk-dapp/reduxStore/store";
import {
    GetTransactionsByHashesReturnType as _,
    PendingTransactionsType,
} from "@multiversx/sdk-dapp/types/transactions.types";
import { Unarray } from "interface/utilities";
import { TransactionDecoder, TransactionMetadata } from "@elrondnetwork/transaction-decoder";

export type GetTransactionsByHashesReturnType = Array<
    Unarray<_> & { raw: any, meta?: TransactionMetadata }
>;
export async function getTransactionsByHashes(
    pendingTransactions: PendingTransactionsType
): Promise<GetTransactionsByHashesReturnType> {
    const decoder = new TransactionDecoder();
    const apiAddress = apiAddressSelector(store.getState());
    const hashes = pendingTransactions.map((tx) => tx.hash);
    const { data: responseData } = await axios.get(
        `${apiAddress}/transactions`,
        {
            params: {
                hashes: hashes.join(","),
                withScResults: true,
            },
        }
    );

    return pendingTransactions.map(({ hash, previousStatus }) => {
        const txOnNetwork = responseData.find(
            (txResponse: any) => txResponse?.txHash === hash
        );

        return {
            hash,
            data: txOnNetwork?.data,
            invalidTransaction: txOnNetwork == null,
            status: txOnNetwork?.status,
            results: txOnNetwork?.results,
            sender: txOnNetwork?.sender,
            receiver: txOnNetwork?.receiver,
            previousStatus,
            hasStatusChanged:
                txOnNetwork && txOnNetwork.status !== previousStatus,

            raw: txOnNetwork,
            meta: txOnNetwork ? decoder.getTransactionMetadata({
                data: txOnNetwork.data,
                receiver: txOnNetwork.receiver,
                sender: txOnNetwork.sender,
                value: "0",
                type: "",
            }) : undefined,
        };
    });
}
