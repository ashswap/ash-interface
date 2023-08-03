import Contract from "./contract";
import feeDistributorAbi from "assets/abi/fee_distributor.abi.json";
import { Address } from "@multiversx/sdk-core/out";
import { ENVIRONMENT } from "const/env";
import { WEEK } from "const/ve";

class FeeDistributorContract extends Contract<typeof feeDistributorAbi> {
    constructor(address: string) {
        super(address, feeDistributorAbi);
    }

    async claim(address: Address) {
        const timeCursor = await this.getUserTimeCursor(address);
        const iter = Math.ceil((Math.floor(Date.now() / 1000) - timeCursor) / WEEK);
        const gas = timeCursor === 0 ? 500_000_000 : iter * 10_000_000;
        let interaction = this.contract.methods.claim([address]);
        interaction.withGasLimit(
            ENVIRONMENT.NETWORK === "mainnet" ? 50_000_000 + gas : 500_000_000
        );
        return this.interceptInteraction(interaction);
    }

    async getUserTimeCursor(address: Address): Promise<number> {
        let interaction = this.contract.methods.getUserTimeCursor([address]);
        const { firstValue } = await this.runQuery(interaction);
        return firstValue?.valueOf()?.toNumber() || 0;
    }


}

export default FeeDistributorContract;
