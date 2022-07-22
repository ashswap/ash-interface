import { getProxyProvider } from "@elrondnetwork/dapp-core";
import {
    Address,
    BigUIntValue,
    ContractFunction,
    ProxyProvider,
    Query,
    QueryResponse,
    TokenIdentifierValue,
} from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";
import { queryContractParser } from "helper/serializer";
import IPool from "interface/pool";

const getAmountOut = async (
    poolAddress: string,
    tokenFromId: string,
    tokenToId: string,
    amountIn: BigNumber
) => {
    const proxy: ProxyProvider = getProxyProvider();
    try {
        const { returnData } = await proxy.queryContract(
            new Query({
                address: new Address(poolAddress),
                func: new ContractFunction("estimateAmountOut"),
                args: [
                    new TokenIdentifierValue(Buffer.from(tokenFromId)),
                    new TokenIdentifierValue(Buffer.from(tokenToId)),
                    new BigUIntValue(amountIn),
                ],
            })
        );
        const values = queryContractParser(
            returnData[0],
            "tuple3<BigUint, BigUint, bytes>"
        );

        return values[0].valueOf().field0 as BigNumber;
    } catch (error) {
        return new BigNumber(0);
    }
};

const getAmountOutMaiarPool = async (
    poolAddress: string,
    tokenFromId: string,
    amountIn: BigNumber
) => {
    const proxy: ProxyProvider = getProxyProvider();
    try {
        const { returnData } = await proxy.queryContract(
            new Query({
                address: new Address(poolAddress),
                func: new ContractFunction("getAmountOut"),
                args: [
                    new TokenIdentifierValue(Buffer.from(tokenFromId)),
                    new BigUIntValue(amountIn),
                ],
            })
        );
        return (
            queryContractParser(returnData[0], "BigUint")?.[0]?.valueOf() ||
            new BigNumber(0)
        );
    } catch (error) {}
    return new BigNumber(0);
};

const calculateAmountOut = async (
    pool: IPool,
    tokenFromId: string,
    tokenToId: string,
    amountIn: BigNumber
) => {
    if (pool.isMaiarPool) {
        return await getAmountOutMaiarPool(pool.address, tokenFromId, amountIn);
    }
    return await getAmountOut(pool.address, tokenFromId, tokenToId, amountIn);
};

const getReserveMaiarPool = async (pool: IPool) => {
    const proxy: ProxyProvider = getProxyProvider();
    const res = await proxy.queryContract(
        new Query({
            address: new Address(pool.address),
            func: new ContractFunction("getReservesAndTotalSupply"),
        })
    );
    const [token1, token2, supply] = res.returnData.map(
        (data) => queryContractParser(data, "BigUint")[0].valueOf() as BigNumber
    );
    return {
        token1,
        token2,
        supply,
    };
};

const getFeePct = async (pool: IPool) => {
    const proxy: ProxyProvider = getProxyProvider();
    try {
        let feeRes: QueryResponse;
        if (pool.isMaiarPool) {
            feeRes = await proxy.queryContract(
                new Query({
                    address: new Address(pool.address),
                    func: new ContractFunction("getTotalFeePercent"),
                })
            );
        } else {
            feeRes = await proxy.queryContract(
                new Query({
                    address: new Address(pool.address),
                    func: new ContractFunction("getSwapFeePercent"),
                })
            );
        }
        let fee = new BigNumber(
            "0x" + Buffer.from(feeRes.returnData[0], "base64").toString("hex")
        );

        fee = fee.div(new BigNumber(100000));
        return fee;
    } catch (error) {
        console.error(error);
    }
    return new BigNumber(0);
};

const getTokenInLP = async (ownLiquidity: BigNumber, poolAddress: string) => {
    const proxy: ProxyProvider = getProxyProvider();
    return proxy
        .queryContract(
            new Query({
                address: new Address(poolAddress),
                func: new ContractFunction("estimateRemoveLiquidity"),
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
                value0: new BigNumber(values[0].valueOf().field0.toString()),
                value1: new BigNumber(values[0].valueOf().field1.toString()),
            };
        });
};

export const queryPoolContract = {
    getAmountOut,
    getAmountOutMaiarPool,
    calculateAmountOut,
    getFeePct,
    getReserveMaiarPool,
    getTokenInLP
};
