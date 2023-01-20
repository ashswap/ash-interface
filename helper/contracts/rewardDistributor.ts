import Contract from "./contract";
import rewardDistributorAbi from "assets/abi/reward_distributor.abi.json";
import { Address } from "@elrondnetwork/erdjs/out";
import moment from "moment";
import BigNumber from "bignumber.js";
import { getAddress } from "@elrondnetwork/dapp-core/utils";

class RewardDistributorContract extends Contract {
    constructor(address: string) {
        super(address, rewardDistributorAbi);
    }

    async claim(address: Address) {
        let interaction = this.contract.methods.claim([address]);
        interaction.withGasLimit(100_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    async estimateReward(address: Address, ts = moment().unix()) {
        let interaction = this.contract.methods.estimateReward([address, ts]);
        const query = interaction.check().buildQuery();
        const res = await this.getProxy().queryContract(query);
        const { firstValue } = this.resultParser.parseQueryResponse(
            res,
            interaction.getEndpoint()
        );
        return firstValue?.valueOf() as BigNumber;
    }

    async isClaimable() {
        const address = await getAddress();
        let interaction = this.contract.methods.isClaimable([new Address(address)]);
        const query = interaction.check().buildQuery();
        const res = await this.getProxy().queryContract(query);
        const { firstValue } = this.resultParser.parseQueryResponse(
            res,
            interaction.getEndpoint()
        );
        return firstValue?.valueOf() as boolean;
    }

    async getStartClaimableTs() {
        let interaction = this.contract.methods.getStartClaimableTs([]);
        const query = interaction.check().buildQuery();
        const res = await this.getProxy().queryContract(query);
        const { firstValue } = this.resultParser.parseQueryResponse(
            res,
            interaction.getEndpoint()
        );
        return firstValue?.valueOf() as BigNumber;
    }
}

export default RewardDistributorContract;
