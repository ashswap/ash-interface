import { Address, TokenTransfer } from "@multiversx/sdk-core/out";
import { getAddress } from "@multiversx/sdk-dapp/utils";
import aggregatorAbi from "assets/abi/aggregator.abi.json";
import BigNumber from "bignumber.js";
import Contract from "./contract";
export type AggregatorStep = {
    token_in: string;
    token_out: string;
    amount_in: BigNumber;
    pool_address: string;
    function_name: string;
    arguments: Buffer[];
};

class AggregatorContract extends Contract<typeof aggregatorAbi> {
    constructor(address: string) {
        super(address, aggregatorAbi);
    }

    async aggregate(
        tokenPayments: TokenTransfer[],
        steps: AggregatorStep[],
        limits: { token: string; amount: BigNumber }[]
    ) {
        let interaction = this.contract.methods.aggregate([steps, ...limits]);
        interaction
            .withMultiESDTNFTTransfer(tokenPayments)
            .withSender(new Address(await getAddress()));
        interaction.withGasLimit(20_000_000 + steps.length * 15_000_000);
        return this.interceptInteraction(interaction);
    }
}

export default AggregatorContract;
