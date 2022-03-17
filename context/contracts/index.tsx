import { Address, ContractFunction, Query, BigUIntValue, CallArguments, Transaction, Nonce, TransactionHash, SmartContract, ChainID, GasPrice, GasLimit } from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";
import { gasLimit, gasPrice, network } from "const/network";
import { useDappContext } from "context/dapp";
import { useWallet } from "context/wallet";
import { toEGLDD } from "helper/balance";
import { queryContractParser } from "helper/serializer";
import IPool from "interface/pool";
import { createContext, useCallback, useContext } from "react";
import { ContractsState, initContractsState } from "./state";
const emptyTx = new Transaction({
    nonce: new Nonce(0),
    receiver: new Address(),
});

const emptyTxHash = new TransactionHash("");
const context = createContext<ContractsState>(initContractsState);
const useContracts = () => {
    const ctx = useContext(context);
    if (ctx === undefined) {
      throw new Error("useContracts must be used within a ContractsProvider");
    }
    return ctx;
}

export const ContractsProvider = ({children}: any) => {
    const dapp = useDappContext();
    const {tokenPrices} = useWallet();
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
                    const values = queryContractParser(returnData[0], "tuple2<BigUint,BigUint>");
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
            const {value0, value1} = await getTokenInLP(ownLiquidity, pool.address);
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
    const createTransaction = useCallback(
        async (address: Address, arg: CallArguments) => {
            if (!dapp.address || !dapp.dapp.proxy || !dapp.dapp.provider) {
                return emptyTx;
            }

            let account = await dapp.dapp.proxy.getAccount(
                new Address(dapp.address)
            );

            let contract = new SmartContract({
                address,
            });

            let tx = contract.call(arg);
            tx = new Transaction({
                chainID: new ChainID(network.id),
                nonce: account.nonce,
                data: tx.getData(),
                receiver: address,
                gasPrice: new GasPrice(gasPrice),
                gasLimit: new GasLimit(gasLimit),
                version: tx.getVersion(),
            });
            return tx;
        },
        [dapp.address, dapp.dapp.proxy, dapp.dapp.provider]
    );
    const callContract = useCallback(
        async (address: Address, arg: CallArguments) => {
            if (!dapp.address || !dapp.dapp.proxy || !dapp.dapp.provider) {
                return emptyTxHash;
            }

            const tx = await createTransaction(address, arg);
            const signedTx = await dapp.dapp.provider.signTransaction(tx);
            return await dapp.dapp.proxy.sendTransaction(signedTx);
        },
        [dapp.address, dapp.dapp.proxy, dapp.dapp.provider, createTransaction]
    );

    return <context.Provider value={{
        ...initContractsState,
        getTokenInLP,
        getLPValue,
        createTransaction,
        callContract

    }}>
        {children}
    </context.Provider>
}

export default useContracts;