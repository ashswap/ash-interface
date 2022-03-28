import {
    Address,
    ContractFunction,
    Query,
    BigUIntValue,
    CallArguments,
    TransactionHash,
} from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";
import { useDappContext } from "context/dapp";
import { useWallet } from "context/wallet";
import { toEGLDD } from "helper/balance";
import { queryContractParser } from "helper/serializer";
import {
    useCreateTransaction,
    useSendTransaction,
    useSignTransaction,
} from "helper/transactionMethods";
import IPool from "interface/pool";
import { createContext, useCallback, useContext } from "react";
import { ContractsState, initContractsState } from "./state";

const emptyTxHash = new TransactionHash("");
const context = createContext<ContractsState>(initContractsState);
const useContracts = () => {
    const ctx = useContext(context);
    if (ctx === undefined) {
        throw new Error("useContracts must be used within a ContractsProvider");
    }
    return ctx;
};

export const ContractsProvider = ({ children }: any) => {
    const dapp = useDappContext();
    const createTransaction = useCreateTransaction();
    const signTx = useSignTransaction();
    const sendTx = useSendTransaction();
    const { tokenPrices } = useWallet();
    const getTokenInLP = useCallback(
        (ownLiquidity: BigNumber, poolAddress: string) => {
            return dapp.dapp.proxy
                .queryContract(
                    new Query({
                        address: new Address(poolAddress),
                        func: new ContractFunction("getRemoveLiquidityTokens"),
                        args: [
                            new BigUIntValue(ownLiquidity),
                            new BigUIntValue(new BigNumber(0)),
                            new BigUIntValue(new BigNumber(0)),
                        ],
                    })
                )
                .then(({ returnData }) => {
                    const values = queryContractParser(
                        returnData[0],
                        "tuple2<BigUint,BigUint>"
                    );
                    return {
                        value0: new BigNumber(
                            values[0].valueOf().field0.toString()
                        ),
                        value1: new BigNumber(
                            values[0].valueOf().field1.toString()
                        ),
                    };
                });
        },
        [dapp.dapp.proxy]
    );
    const getLPValue = useCallback(
        async (ownLiquidity: BigNumber, pool: IPool) => {
            const { value0, value1 } = await getTokenInLP(
                ownLiquidity,
                pool.address
            );
            let token0 = pool.tokens[0];
            let token1 = pool.tokens[1];

            if (!value0 || !value1) {
                return new BigNumber(0);
            }

            const valueUsd0 = toEGLDD(token0.decimals, value0).multipliedBy(
                tokenPrices[token0.id]
            );
            const valueUsd1 = toEGLDD(token1.decimals, value1).multipliedBy(
                tokenPrices[token1.id]
            );
            return valueUsd0.plus(valueUsd1);
        },
        [tokenPrices, getTokenInLP]
    );
    const callContract = useCallback(
        async (address: Address, arg: CallArguments) => {
            if (!dapp.address || !dapp.dapp.proxy || !dapp.dapp.provider) {
                return emptyTxHash;
            }

            const tx = await createTransaction(address, arg);
            const signedTx = await signTx(tx);
            return await sendTx(signedTx);
        },
        [
            dapp.address,
            dapp.dapp.proxy,
            dapp.dapp.provider,
            createTransaction,
            signTx,
            sendTx,
        ]
    );

    return (
        <context.Provider
            value={{
                ...initContractsState,
                getTokenInLP,
                getLPValue,
                callContract,
            }}
        >
            {children}
        </context.Provider>
    );
};

export default useContracts;
