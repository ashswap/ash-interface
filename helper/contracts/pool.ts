import { getAddress } from "@multiversx/sdk-dapp/utils";
import {
    Address,
    BigUIntValue,
    ContractFunction,
    Query,
    TokenIdentifierValue,
    TokenPayment,
} from "@multiversx/sdk-core";
import poolAbi from "assets/abi/pool.abi.json";
import BigNumber from "bignumber.js";
import { queryContractParser } from "helper/serializer";
import IPool from "interface/pool";
import { getProxyNetworkProvider } from "../proxy/util";
import Contract from "./contract";
type TokenAttributes = {
    reserve: BigNumber;
    rate: BigNumber;
};
type ExchangeAttributes = {
    token: string;
    attribute: TokenAttributes;
    final_amount: BigNumber;
};
type ExchangeResultType = {
    total_fee: BigNumber;
    admin_fee: BigNumber;
    token_in: ExchangeAttributes;
    token_out: ExchangeAttributes;
};
type AddLiquidityAttributes = {
    token: string;
    attribute: TokenAttributes;
    amount_added: BigNumber;
    total_fee: BigNumber;
    admin_fee: BigNumber;
};
type AddLiquidityResultType = {
    mint_amount: BigNumber;
    tokens: AddLiquidityAttributes[];
};
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
        .then((val) => val.token_out.final_amount);
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
class PoolContract extends Contract<typeof poolAbi> {
    private poolType?: "PlainPool" | "LendingPool" | "MetaPool";
    constructor(address: string) {
        super(address, poolAbi);
    }

    async getPoolType() {
        if (this.poolType) return this.poolType;
        let interaction = this.contract.methods.getPoolType();
        const { firstValue } = await this.runQuery(interaction);
        const type = firstValue?.valueOf();
        this.poolType = type?.name;
        return this.poolType!;
    }

    async getAmountOut(
        tokenFromId: string,
        tokenToId: string,
        amountIn: BigNumber
    ): Promise<ExchangeResultType> {
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
        mintAmtMin: BigNumber,
        receiver = Address.Zero()
    ) {
        const type = await this.getPoolType();
        const sender = await getAddress();
        let interaction = this.contract.methods.addLiquidity([
            mintAmtMin,
            receiver,
        ]);
        interaction
            .withMultiESDTNFTTransfer(tokenPayments, new Address(sender))
            .withGasLimit(
                type === "PlainPool"
                    ? 10_000_000 + tokenPayments.length * 2_000_000
                    : 20_000_000
            ); // 20m gas limit for lendingPool with 2 tokens
        interaction = this.interceptInteraction(interaction);
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
        const type = await this.getPoolType();
        let interaction = this.contract.methods.exchange([
            tokenToId,
            minWeiOut,
        ]);
        interaction
            .withSingleESDTTransfer(tokenPayment)
            .withGasLimit(type === "PlainPool" ? 8_000_000 : 15_000_000); // 15m gas limit for lendingPool
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    async estimateAddLiquidity(
        tokenAmounts: BigNumber[]
    ): Promise<AddLiquidityResultType> {
        let interaction = this.contract.methods.estimateAddLiquidity([
            tokenAmounts,
        ]);
        const res = await this.getProxy().queryContract(
            interaction.check().buildQuery()
        );
        const { firstValue } = this.resultParser.parseQueryResponse(
            res,
            interaction.getEndpoint()
        );
        return firstValue?.valueOf();
    }
}

export default PoolContract;
