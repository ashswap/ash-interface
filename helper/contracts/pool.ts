import { getAddress } from "@elrondnetwork/dapp-core/utils";
import {
    Address,
    BigUIntValue,
    ContractFunction,
    Query,
    TokenIdentifierValue,
    TokenPayment,
} from "@elrondnetwork/erdjs";
import poolAbi from "assets/abi/pool.abi.json";
import BigNumber from "bignumber.js";
import { queryContractParser } from "helper/serializer";
import IPool from "interface/pool";
import { getProxyNetworkProvider } from "../proxy/util";
import Contract from "./contract";

const getAmountOutMaiarPool = async (
    poolAddress: string,
    tokenFromId: string,
    amountIn: BigNumber
): Promise<BigNumber> => {
    const proxy = getProxyNetworkProvider();
    try {
        const { returnData } = await proxy.queryContract(
            new Query({
                address: new Address(poolAddress),
                func: new ContractFunction("getAmountOut"),
                args: [
                    new TokenIdentifierValue(tokenFromId),
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
    return await new PoolContract(pool.address)
        .getAmountOut(tokenFromId, tokenToId, amountIn)
        .then((val) => val.amount_out);
};

const getReserveMaiarPool = async (pool: IPool) => {
    const proxy = getProxyNetworkProvider();
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

export const queryPoolContract = {
    getAmountOutMaiarPool,
    calculateAmountOut,
    getReserveMaiarPool,
};
class PoolContract extends Contract {
    constructor(address: string) {
        super(address, poolAbi);
    }

    async getAmountOut(
        tokenFromId: string,
        tokenToId: string,
        amountIn: BigNumber
    ): Promise<{
        admin_fee: BigNumber;
        amount_out: BigNumber;
        token_in_balance: BigNumber;
        token_out_balance: BigNumber;
        total_fee: BigNumber;
    }> {
        const interaction = this.contract.methods.estimateAmountOut([
            tokenFromId,
            tokenToId,
            amountIn,
        ]);
        const query = interaction.check().buildQuery();
        const res = await this.getProxy().queryContract(query);
        const { firstValue } = this.resultParser.parseQueryResponse(
            res,
            interaction.getEndpoint()
        );
        return firstValue?.valueOf() as any;
    }

    async addLiquidity(
        tokenPayments: TokenPayment[],
        tokensAmtMin: BigNumber[],
        receiver = Address.Zero()
    ) {
        const sender = await getAddress();
        let interaction = this.contract.methods.addLiquidity([
            receiver,
            ...tokensAmtMin,
        ]);
        if (tokenPayments.length === 1) {
            interaction.withSingleESDTTransfer(tokenPayments[0]);
        } else {
            interaction.withMultiESDTNFTTransfer(
                tokenPayments,
                new Address(sender)
            );
        }
        interaction = this.interceptInteraction(
            interaction.withGasLimit(12_000_000)
        );
        return interaction.check().buildTransaction();
    }

    async removeLiquidity(
        tokenPayment: TokenPayment,
        tokensAmtMin: BigNumber[]
    ) {
        let interaction = this.contract.methods.removeLiquidity(tokensAmtMin);
        interaction
            .withSingleESDTTransfer(tokenPayment)
            .withGasLimit(9_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    async exchange(
        tokenPayment: TokenPayment,
        tokenToId: string,
        minWeiOut: BigNumber
    ) {
        let interaction = this.contract.methods.exchange([
            tokenToId,
            minWeiOut,
        ]);
        interaction
            .withSingleESDTTransfer(tokenPayment)
            .withGasLimit(8_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }
}

export default PoolContract;
