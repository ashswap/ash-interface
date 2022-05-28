import {
    AccountInfoSliceNetworkType,
    getAccountProvider,
    getProxyProvider,
    transactionServices,
    useGetAccountInfo,
    useGetLoginInfo,
    useGetNetworkConfig
} from "@elrondnetwork/dapp-core";
import {
    Address,
    CallArguments,
    ChainID,
    ExtensionProvider,
    GasLimit,
    GasPrice, IDappProvider,
    Nonce,
    ProxyProvider,
    SmartContract,
    Transaction
} from "@elrondnetwork/erdjs/out";
import {
    gasLimitBuffer,
    gasPrice,
    maxGasLimit
} from "const/dappConfig";
import { DappSendTransactionsPropsType } from "interface/dappCore";
const emptyTx = new Transaction({
    nonce: new Nonce(0),
    receiver: new Address(),
});
// flow create TXS -> set nonce -> sign TXS -> send TXS -> update local nonce
export const useCreateTransaction = () => {
    const { isLoggedIn } = useGetLoginInfo();
    const { address } = useGetAccountInfo();
    const proxy: ProxyProvider = getProxyProvider();
    const network: AccountInfoSliceNetworkType = useGetNetworkConfig().network;
    /** Create transaction with nonce = 0, set nonce with useSetTransactionsNonce or let useSignTransactions handle it automaticlly  */
    return async (scAddress: Address, arg: CallArguments) => {
        if (!isLoggedIn || !address || !proxy) {
            return emptyTx;
        }

        let contract = new SmartContract({
            address: scAddress,
        });

        let tx = contract.call(arg);
        tx = new Transaction({
            chainID: new ChainID(network.chainId),
            data: tx.getData(),
            receiver: scAddress,
            gasPrice: new GasPrice(gasPrice),
            gasLimit: new GasLimit(
                Math.min(
                    Math.floor(arg.gasLimit.valueOf() * gasLimitBuffer),
                    maxGasLimit
                )
            ),
            version: tx.getVersion(),
        });
        return tx;
    };
};
export const sendTransactions = async (payload: DappSendTransactionsPropsType) => {
    const accProvider: IDappProvider = getAccountProvider();
    if(accProvider instanceof ExtensionProvider){
        await ExtensionProvider.getInstance()?.cancelAction?.();
    }
    return await transactionServices.sendTransactions(payload);
}
