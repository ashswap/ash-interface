import Contract from "./contract";
import farmControllerAbi from "assets/abi/farm_controller.abi.json";
import { Address } from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import { ENVIRONMENT } from "const/env";

class FarmControllerContract extends Contract<typeof farmControllerAbi> {
    constructor(address: string) {
        super(address, farmControllerAbi);
    }

    async voteForFarmWeights(farmAddress: Address, weight: BigNumber) {
        let interaction = this.contract.methods.voteForFarmWeights([
            farmAddress,
            weight,
        ]);
        interaction.withGasLimit(ENVIRONMENT.NETWORK === "mainnet" ? 50_000_000 : 500_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }
}

export default FarmControllerContract;
