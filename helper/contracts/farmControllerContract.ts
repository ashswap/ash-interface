import Contract from "./contract";
import farmControllerAbi from "assets/abi/farm_controller.abi.json";
import { Address } from "@multiversx/sdk-core/out";
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
        interaction.withGasLimit(
            ENVIRONMENT.NETWORK === "mainnet" ? 50_000_000 : 500_000_000
        );
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    async getFarmTypes(farmAddress: string) {
        let interaction = this.contract.methods.getFarmTypes([new Address(farmAddress)]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as number) || 0;
    }
    async getTimeSum(farmType: number) {
        let interaction = this.contract.methods.getTimeSum([farmType]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as number) || 0;
    }
    async getPointsSum(farmType: number, ts: number) {
        let interaction = this.contract.methods.getPointsSum([farmType, ts]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as {bias: BigNumber, slope: BigNumber}) || {bias: new BigNumber(0), slope: new BigNumber(0)};
    }

    async getChangesSum(farmType: number, ts: number) {
        let interaction = this.contract.methods.getChangesSum([farmType, ts]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }
    async getVotingEscrowAddress() {
        let interaction = this.contract.methods.getVotingEscrowAddress([]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as Address);
    }
    async getFarmRelativeWeight(farmAddress: string, time: number) {
        let interaction = this.contract.methods.getFarmRelativeWeight([new Address(farmAddress), time]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber);
    }
}

export default FarmControllerContract;
