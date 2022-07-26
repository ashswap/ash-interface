import Contract from "./contract";
import votingEscowAbi from "assets/abi/voting_escrow.abi.json";
import { TokenPayment } from "@elrondnetwork/erdjs/out";
class VotingEscrowContract extends Contract {
    constructor(address: string){
        super(address, votingEscowAbi);
    }

    async createLock(tokenPayment: TokenPayment, unlockTS: number) {
        let interaction = this.contract.methods.create_lock([unlockTS]);
        interaction.withSingleESDTTransfer(tokenPayment).withGasLimit(7_000_000);
        return this.interceptInteraction(interaction).check().buildTransaction();
    }

    async increaseAmount(tokenPayment: TokenPayment) {
        let interaction = this.contract.methods.increase_amount([]);
        interaction.withSingleESDTTransfer(tokenPayment).withGasLimit(7_000_000);
        return this.interceptInteraction(interaction).check().buildTransaction();
    }

    async increaseUnlockTime(unlockTS: number) {
        let interaction = this.contract.methods.increase_unlock_time([unlockTS]);
        interaction.withGasLimit(7_000_000);
        return this.interceptInteraction(interaction).check().buildTransaction();
    }

    async withdraw() {
        let interaction = this.contract.methods.withdraw([]);
        interaction.withGasLimit(7_000_000);
        return this.interceptInteraction(interaction).check().buildTransaction();
    }

}

export default VotingEscrowContract;