import { getAddress } from "@elrondnetwork/dapp-core/utils";
import { Address, TokenPayment } from "@elrondnetwork/erdjs/out";
import farmBribeAbi from "assets/abi/farm_bribe.abi.json";
import Contract from "./contract";

class FarmBribeContract extends Contract {
    constructor(address: string) {
        super(address, farmBribeAbi);
    }

    async addRewardAmount(farmAddress: Address, tokenPayments: TokenPayment[]) {
        const sender = await getAddress();
        const interaction = this.contract.methods
            .addRewardAmount([farmAddress])
            .withMultiESDTNFTTransfer(tokenPayments, new Address(sender))
            .withGasLimit(100_000_000);
        return this.interceptInteraction(interaction).check().buildTransaction();
    }

    async claimReward(farmAddress: Address, tokenId: string){
        const interaction = this.contract.methods.claimReward([farmAddress, tokenId]).withGasLimit(500_000_000);
        return this.interceptInteraction(interaction).check().buildTransaction();
    }
}

export default FarmBribeContract;
