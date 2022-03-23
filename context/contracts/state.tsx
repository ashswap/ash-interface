import { Address, CallArguments, Transaction, Nonce, TransactionHash } from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";
import IPool from "interface/pool";
const bigZero = new BigNumber(0);
const emptyTx = new Transaction({
    nonce: new Nonce(0),
    receiver: new Address(),
});

const emptyTxHash = new TransactionHash("");

export interface ContractsState {
    getTokenInLP: (ownLiquidity: BigNumber, poolAddress: string) => Promise<{
        value0: BigNumber;
        value1: BigNumber;
    }>;
    getLPValue: (ownLiquidity: BigNumber, pool: IPool) => Promise<BigNumber>;
    createTransaction: (address: Address, arg: CallArguments) => Promise<Transaction>;
    callContract: (
        addr: Address,
        arg: CallArguments
    ) => Promise<TransactionHash>;
    sendMultipleTxs: (txs: Transaction[]) => Promise<{[key: number]: string}>
}
export const initContractsState: ContractsState = {
    getTokenInLP: () => Promise.resolve({value0: bigZero, value1: bigZero}),
    getLPValue: () => Promise.resolve(bigZero),
    createTransaction: () => Promise.resolve(emptyTx),
    callContract: () => Promise.resolve(emptyTxHash),
    sendMultipleTxs: () => Promise.resolve({})
}