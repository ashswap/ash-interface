import Contract from "./contract";
import votingEscowAbi from "assets/abi/voting_escrow.abi.json";
import { TokenTransfer } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
import { ENVIRONMENT } from "const/env";
const gas = ENVIRONMENT.NETWORK === "mainnet" ? 10_000_000 : 100_000_000;
class VotingEscrowContract extends Contract<typeof votingEscowAbi> {
    constructor(address: string) {
        super(address, votingEscowAbi);
    }

    async createLock(tokenPayment: TokenTransfer, unlockTS: number) {
        let interaction = this.contract.methods.create_lock([unlockTS]);
        interaction
            .withSingleESDTTransfer(tokenPayment)
            .withGasLimit(gas); // 7m
        return this.interceptInteraction(interaction);
    }

    async increaseAmount(tokenPayment: TokenTransfer) {
        let interaction = this.contract.methods.increase_amount([]);
        interaction
            .withSingleESDTTransfer(tokenPayment)
            .withGasLimit(gas); //7m
        return this.interceptInteraction(interaction);
    }

    async increaseUnlockTime(unlockTS: number) {
        let interaction = this.contract.methods.increase_unlock_time([
            unlockTS,
        ]);
        interaction.withGasLimit(gas); //7m
        return this.interceptInteraction(interaction);
    }

    async withdraw() {
        let interaction = this.contract.methods.withdraw([]);
        interaction.withGasLimit(gas); //7m
        return this.interceptInteraction(interaction);
    }

    async getUserLocked(
        address: string
    ): Promise<{ amount: BigNumber; end: BigNumber }> {
        let interaction = this.contract.methods.getUserLocked([address]);
        const { firstValue } = await this.runQuery(interaction);
        return firstValue?.valueOf();
    }

    async getUserBalanceAtTs(address: string, ts: number){
        let interaction = this.contract.methods.getUserBalanceAtTs([address, ts]);
        const { firstValue } = await this.runQuery(interaction);
        return firstValue?.valueOf();
    }
}

export default VotingEscrowContract;
