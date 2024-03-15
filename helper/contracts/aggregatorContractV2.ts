import { Address, TokenTransfer } from "@multiversx/sdk-core/out";
import aggregatorV2Abi from "assets/abi/aggregator_v2.abi.json";
import BigNumber from "bignumber.js";
import Contract from "./contract";
export const AG_MAX_FEE_PERCENT = 100_000;
export type AggregatorStep = {
    token_in: string;
    token_out: string;
    amount_in: BigNumber;
    pool_address: string;
    function_name: string;
    arguments: Buffer[];
};

class AggregatorV2Contract extends Contract<typeof aggregatorV2Abi> {
    constructor(address: string) {
        super(address, aggregatorV2Abi);
    }

    async aggregate(
        payment: TokenTransfer,
        tokenOut: string,
        minAmtOut: BigNumber,
        steps: AggregatorStep[],
        protocol?: string
    ) {
        const params = [payment.tokenIdentifier, tokenOut, minAmtOut, steps];
        if (protocol && Address.isValid(protocol)) {
            params.push(protocol);
        }
        const interaction = this.contract.methods.aggregate(params);

        if (payment.isEgld()) {
            interaction.withValue(payment.amountAsBigInteger);
        } else {
            interaction.withSingleESDTTransfer(payment);
        }

        interaction.withGasLimit(20_000_000 + steps.length * 15_000_000);
        return this.interceptInteraction(interaction);
    }
}

export default AggregatorV2Contract;
