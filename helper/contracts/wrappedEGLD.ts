import { TokenTransfer } from "@multiversx/sdk-core/out";
import wegldAbi from "assets/abi/multiversx-wegld-swap-sc.abi.json";
import BigNumber from "bignumber.js";
import Contract from "./contract";

class WrappedEGLDContract extends Contract<typeof wegldAbi> {
    constructor(address: string) {
        super(address, wegldAbi);
    }

    async wrapEgld(amt: BigNumber) {
        let interaction = this.contract.methods.wrapEgld([]);
        interaction.withValue(amt);
        interaction.withGasLimit(3_000_000);
        return this.interceptInteraction(interaction);
    }

    async unwrapEgld(tokenPayment: TokenTransfer) {
        let interaction = this.contract.methods.unwrapEgld([]);
        interaction.withSingleESDTTransfer(tokenPayment);
        interaction.withGasLimit(3_000_000);
        return this.interceptInteraction(interaction);
    }
}

export default WrappedEGLDContract;
