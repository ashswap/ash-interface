import Contract from "./contract";
import lkASHAbi from "assets/abi/simple-lock-whitelist.abi.json";
import { Address, TokenPayment } from "@elrondnetwork/erdjs/out";
import { getAddress } from "@elrondnetwork/dapp-core/utils";

class LKASHContract extends Contract {
    constructor(address: string) {
        super(address, lkASHAbi);
    }

    async lockTokens(tokenPayment: TokenPayment, epoch: number) {
        const interaction = this.contract.methods.lockTokens([epoch]);
        interaction.withSingleESDTTransfer(tokenPayment).withGasLimit(100_000_000);
        return this.interceptInteraction(interaction).check().buildTransaction();
    }

    async unlockTokens(tokenPayment: TokenPayment) {
        const address = await getAddress();
        let interaction = this.contract.methods.unlockTokens([new Address(address)]);
        interaction.withSingleESDTNFTTransfer(tokenPayment, new Address(address)).withGasLimit(10_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

}

export default LKASHContract;
