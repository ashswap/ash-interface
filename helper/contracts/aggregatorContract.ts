import { Address, Interaction, TokenTransfer } from "@multiversx/sdk-core/out";
import { getAddress } from "@multiversx/sdk-dapp/utils";
import aggregatorAbi from "assets/abi/aggregator.abi.json";
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

class AggregatorContract extends Contract<typeof aggregatorAbi> {
    constructor(address: string) {
        super(address, aggregatorAbi);
    }

    private isEgld(id: string) {
        return id === "EGLD";
    }

    async aggregate(
        payments: TokenTransfer[],
        steps: AggregatorStep[],
        limits: { token: string; amount: BigNumber }[]
    ) {
        const interaction = this.contract.methods.aggregate([steps, ...limits]);
        interaction
            .withMultiESDTNFTTransfer(payments)
            .withSender(new Address(await getAddress()));
        interaction.withGasLimit(20_000_000 + steps.length * 15_000_000);
        return this.interceptInteraction(interaction);
    }

    async _aggregateEgld(
        egldAmount: BigNumber.Value,
        steps: AggregatorStep[],
        limits: { token: string; amount: BigNumber }[],
        protocol?: string
    ) {
        const params: any[] = [steps, limits];
        if (protocol && protocol !== Address.Zero().bech32()) {
            params.push(protocol);
        }
        const interaction = this.contract.methods.aggregateEgld(params);
        interaction
            .withValue(TokenTransfer.egldFromBigInteger(egldAmount))
            .withSender(new Address(await getAddress()));
        interaction.withGasLimit(20_000_000 + steps.length * 15_000_000);
        return this.interceptInteraction(interaction);
    }

    async _aggregateEsdt(
        esdtPayment: TokenTransfer,
        steps: AggregatorStep[],
        limits: { token: string; amount: BigNumber }[],
        returnEgld: boolean,
        protocol?: string
    ) {
        const params: any[] = [steps, limits, returnEgld];
        if (protocol && protocol !== Address.Zero().bech32()) {
            params.push(protocol);
        }
        const interaction = this.contract.methods.aggregateEsdt(params);
        interaction
            .withSingleESDTTransfer(esdtPayment)
            .withSender(new Address(await getAddress()));
        interaction.withGasLimit(20_000_000 + steps.length * 15_000_000);
        return this.interceptInteraction(interaction);
    }
}

export default AggregatorContract;
