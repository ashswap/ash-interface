import Contract from "./contract";
import feeDistributorAbi from "assets/abi/fee_distributor.abi.json";
import { Address } from "@elrondnetwork/erdjs/out";
import { ENVIRONMENT } from "const/env";

class FeeDistributorContract extends Contract<typeof feeDistributorAbi> {
    constructor(address: string) {
        super(address, feeDistributorAbi);
    }

    async claim(address: Address) {
        let interaction = this.contract.methods.claim([address]);
        interaction.withGasLimit(ENVIRONMENT.NETWORK === "mainnet" ? 50_000_000 : 500_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }
}

export default FeeDistributorContract;
