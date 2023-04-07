import { Address, TokenPayment } from "@multiversx/sdk-core/out";
import { getAddress } from "@multiversx/sdk-dapp/utils";
import daoBribeAbi from "assets/abi/dao_bribe.abi.json";
import BigNumber from "bignumber.js";
import Contract from "./contract";

class DAOBribeContract extends Contract<typeof daoBribeAbi> {
    constructor(address: string) {
        super(address, daoBribeAbi);
    }

    async addRewardAmount(proposalID: number, tokenPayments: TokenPayment[]) {
        const address = await getAddress();
        let interaction = this.contract.methods.addRewardAmount([proposalID]);
        interaction.withMultiESDTNFTTransfer(tokenPayments, new Address(address));
        interaction.withGasLimit(10_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }
    async withdrawReward(proposalID: number) {
        let interaction = this.contract.methods.withdrawReward([proposalID]);
        interaction.withGasLimit(50_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }
    async claimReward(proposalID: number, tokenIDs: string[]) {
        let interaction = this.contract.methods.claimReward([proposalID, ...tokenIDs]);
        interaction.withGasLimit(10_000_000 + tokenIDs.length * 7_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }
    async getClaimable(proposalID: number, tokenID: string, address: string): Promise<BigNumber> {
        let interaction = this.contract.methods.getClaimable([proposalID, tokenID, address]);
        const {firstValue} = await this.runQuery(interaction);
        return firstValue?.valueOf();
    }
    async isClaimed(proposalID: number, tokenID: string, address: string): Promise<boolean> {
        let interaction = this.contract.methods.isClaimed([proposalID, tokenID, address]);
        const {firstValue} = await this.runQuery(interaction);
        return Boolean(firstValue?.valueOf());
    }

}

export default DAOBribeContract;
