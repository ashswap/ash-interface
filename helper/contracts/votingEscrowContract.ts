import Contract from "./contract";
import votingEscowAbi from "assets/abi/voting_escrow.abi.json";
import { TokenPayment } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
class VotingEscrowContract extends Contract<typeof votingEscowAbi> {
    constructor(address: string) {
        super(address, votingEscowAbi);
    }

    async createLock(tokenPayment: TokenPayment, unlockTS: number) {
        let interaction = this.contract.methods.create_lock([unlockTS]);
        interaction
            .withSingleESDTTransfer(tokenPayment)
            .withGasLimit(100_000_000); // 7m
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    async increaseAmount(tokenPayment: TokenPayment) {
        let interaction = this.contract.methods.increase_amount([]);
        interaction
            .withSingleESDTTransfer(tokenPayment)
            .withGasLimit(100_000_000); //7m
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    async increaseUnlockTime(unlockTS: number) {
        let interaction = this.contract.methods.increase_unlock_time([
            unlockTS,
        ]);
        interaction.withGasLimit(100_000_000); //7m
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    async withdraw() {
        let interaction = this.contract.methods.withdraw([]);
        interaction.withGasLimit(100_000_000); //7m
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    async getUserLocked(
        address: string
    ): Promise<{ amount: BigNumber; end: BigNumber }> {
        let interaction = this.contract.methods.getUserLocked([address]);
        const { firstValue } = await this.runQuery(interaction);
        return firstValue?.valueOf();
    }
}

export default VotingEscrowContract;
