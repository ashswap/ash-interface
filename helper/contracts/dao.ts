import {
    Address
} from "@multiversx/sdk-core/out";
import daoAbi from "assets/abi/dao.abi.json";
import BigNumber from "bignumber.js";
import Contract from "./contract";
export type DAOAction = {
    dest_address: Address;
    function_name: string;
    arguments: Buffer[];
};
class DAOContract extends Contract<typeof daoAbi> {
    constructor(address: string) {
        super(address, daoAbi);
    }

    async getProposalVotes(proposalID: number, address: string): Promise<{
        yes_vote: BigNumber;
        no_vote: BigNumber;
    }> {
        let interaction = this.contract.methods.getProposalVotes([proposalID, new Address(address)]);
        const {firstValue} = await this.runQuery(interaction);
        return firstValue?.valueOf() || {yes_vote: new BigNumber(0), no_vote: new BigNumber(0)} ;
    }

    async propose(meta: string, action: DAOAction) {
        let interaction = this.contract.methods.propose([meta, action]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    /**
     * 
     * @param proposalID id of the proposal to be voted on
     * @param yes 1e18 = 100%
     * @param no 1e18 = 100%
     * @returns tx
     */
    async vote(proposalID: number, yes: BigNumber, no: BigNumber) {
        let interaction = this.contract.methods.vote([proposalID, yes, no]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    async execute(proposalID: number) {
        let interaction = this.contract.methods.execute([proposalID]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }
}

export default DAOContract;
