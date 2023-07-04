import farmRouterAbi from "assets/abi/farm_router.abi.json";
import Contract from "./contract";
import { Address } from "@multiversx/sdk-core/out";

class FarmRouterContract extends Contract<typeof farmRouterAbi> {
    constructor(address: string) {
        super(address, farmRouterAbi);
    }

    async getAllFarmAddresses() {
        const interaction = this.contract.methods.getAllFarmAddresses([]);
        const {firstValue} = await this.runQuery(interaction);
        return firstValue?.valueOf() as Address[] || [];
    }
}

export default FarmRouterContract;
