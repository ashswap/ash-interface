import Contract from "./contract";
import farmControllerAbi from "assets/abi/farm_controller.abi.json";
import { Address } from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";

class FarmControllerContract extends Contract {
    constructor(address: string) {
        super(address, farmControllerAbi);
    }

    async checkpoint() {
        let interaction = this.contract.methods.checkpoint();
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    async voteForFarmWeights(farmAddress: Address, weight: BigNumber) {
        let interaction = this.contract.methods.voteForFarmWeights([
            farmAddress,
            weight,
        ]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    async applyRelativeWeight() {
        let interaction = this.contract.methods
            .applyRelativeWeight()
            .withGasLimit(600_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }
}

export default FarmControllerContract;
