import { getProxyProvider } from "@elrondnetwork/dapp-core";
import {
    Address, BigUIntValue, ContractFunction, ProxyProvider, Query, TransactionHash
} from "@elrondnetwork/erdjs";
import { walletTokenPriceState } from "atoms/walletState";
import BigNumber from "bignumber.js";
import { toEGLDD } from "helper/balance";
import { queryContractParser } from "helper/serializer";
import IPool from "interface/pool";
import { createContext, useCallback, useContext } from "react";
import { useRecoilValue } from "recoil";
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
    const proxy: ProxyProvider = getProxyProvider();
    const tokenPrices = useRecoilValue(walletTokenPriceState);
    const getTokenInLP = useCallback(
        (ownLiquidity: BigNumber, poolAddress: string) => {
            return proxy
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
        [proxy]
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

    return (
        <context.Provider
            value={{
                ...initContractsState,
                getTokenInLP,
                getLPValue,
            }}
        >
            {children}
        </context.Provider>
    );
};

export default useContracts;
