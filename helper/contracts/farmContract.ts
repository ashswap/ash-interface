import Contract from "./contract";
import farmAbi from "assets/abi/farm.abi.json";
import { Address, TokenPayment } from "@elrondnetwork/erdjs/out";
import { getAddress } from "@elrondnetwork/dapp-core/utils";
import BigNumber from "bignumber.js";
import { FarmTokenAttrs } from "interface/farm";
class FarmContract extends Contract {
    constructor(address: string){
        super(address, farmAbi);
    }

    async enterFarm(tokenPayments: TokenPayment[], selfBoost = false){
        const sender = await getAddress();
        let interaction = this.contract.methods.enterFarm([selfBoost]);
        interaction.withMultiESDTNFTTransfer(tokenPayments, new Address(sender));
        interaction.withGasLimit(13_000_000 + tokenPayments.length * 2_000_000);
        return this.interceptInteraction(interaction).check().buildTransaction();
    }

    async exitFarm(tokenPayments: TokenPayment[]) {
        const sender = await getAddress();
        let interaction = this.contract.methods.exitFarm([]);
        interaction.withMultiESDTNFTTransfer(tokenPayments, new Address(sender));
        interaction.withGasLimit(13_000_000 + tokenPayments.length * 2_000_000);
        return this.interceptInteraction(interaction).check().buildTransaction();
    }

    async claimRewards(tokenPayments: TokenPayment[], selfBoost = false) {
        const sender = await getAddress();
        let interaction = this.contract.methods.claimRewards([selfBoost]);
        interaction.withMultiESDTNFTTransfer(tokenPayments, new Address(sender));
        interaction.withGasLimit(13_000_000 + tokenPayments.length * 2_000_000);
        return this.interceptInteraction(interaction).check().buildTransaction();
    }

    async calculateRewardsForGivenPosition(wei: BigNumber, attrs: FarmTokenAttrs) {
        let interaction = this.contract.methods.calculateRewardsForGivenPosition([wei, attrs]);
        const {firstValue} = await this.runQuery(interaction);
        return firstValue?.valueOf() as BigNumber || new BigNumber(0);
    }

    async getSlopeBoosted(address: string) {
        let interaction = this.contract.methods.getSlopeBoosted([address]);
        const {firstValue} = await this.runQuery(interaction);
        return firstValue?.valueOf() as BigNumber || new BigNumber(0);
    }
}

export default FarmContract;