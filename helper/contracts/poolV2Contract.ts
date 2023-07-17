import { getAddress } from "@multiversx/sdk-dapp/utils";
import { Address, TokenTransfer } from "@multiversx/sdk-core/out";
import poolV2Abi from "assets/abi/pool_v2.abi.json";
import BigNumber from "bignumber.js";
import Contract from "./contract";

class PoolV2Contract extends Contract<typeof poolV2Abi> {
    constructor(address: string) {
        super(address, poolV2Abi);
    }

    async estimateAmountOut(
        tokenInIndex: number,
        tokenOutIndex: number,
        tokenAmtIn: BigNumber
    ): Promise<{ fee: BigNumber; outputAmount: BigNumber }> {
        let interaction = this.contract.methods.estimateAmountOut([
            tokenInIndex,
            tokenOutIndex,
            tokenAmtIn,
        ]);
        const { firstValue, secondValue } = await this.runQuery(interaction);
        return {
            fee: firstValue?.valueOf(),
            outputAmount: secondValue?.valueOf(),
        };
    }

    async estimateAddLiquidity(amounts: BigNumber[]): Promise<BigNumber> {
        let interaction = this.contract.methods.estimateAddLiquidity([amounts]);
        const { firstValue } = await this.runQuery(interaction);
        return firstValue?.valueOf();
    }

    async estimateRemoveLiquidityOneCoin(
        lpAmount: BigNumber,
        tokenOutIndex: number
    ): Promise<BigNumber> {
        let interaction = this.contract.methods.estimateRemoveLiquidityOneCoin([
            lpAmount,
            tokenOutIndex,
        ]);
        const { firstValue } = await this.runQuery(interaction);
        return firstValue?.valueOf();
    }

    async getTotalSupply(): Promise<BigNumber> {
        let interaction = this.contract.methods.getLpTokenSupply();
        const { firstValue } = await this.runQuery(interaction);
        return firstValue?.valueOf();
    }

    async addLiquidity(
        tokenPayments: TokenTransfer[],
        minMintAmount: BigNumber,
        receiver?: Address
    ) {
        const address = await getAddress();
        let interaction = this.contract.methods.addLiquidity([
            minMintAmount,
            receiver || new Address(address),
        ]);
        interaction
            .withMultiESDTNFTTransfer(tokenPayments)
            .withSender(new Address(address))
            .withGasLimit(35_000_000);
        return this.interceptInteraction(interaction);
    }

    async exchange(tokenPayment: TokenTransfer, mintWeiOut: BigNumber) {
        let interaction = this.contract.methods.exchange([mintWeiOut]);
        interaction
            .withSingleESDTTransfer(tokenPayment)
            .withGasLimit(35_000_000);
        return this.interceptInteraction(interaction);
    }

    async removeLiquidity(
        tokenPayment: TokenTransfer,
        minAmounts: BigNumber[],
        receiver?: Address
    ) {
        const address = await getAddress();
        let interaction = this.contract.methods.removeLiquidity([
            minAmounts,
            receiver || new Address(address),
        ]);
        interaction
            .withSingleESDTTransfer(tokenPayment)
            .withGasLimit(12_000_000);
        return this.interceptInteraction(interaction);
    }

    async removeLiquidityOneCoin(
        tokenPayment: TokenTransfer,
        index: number,
        minAmountOut: BigNumber
    ) {
        let interaction = this.contract.methods.removeLiquidityOneCoin([
            index,
            minAmountOut,
        ]);
        interaction
            .withSingleESDTTransfer(tokenPayment)
            .withGasLimit(18_000_000);
        return this.interceptInteraction(interaction);
    }
}

export default PoolV2Contract;
