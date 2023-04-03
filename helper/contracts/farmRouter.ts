import farmRouterAbi from "assets/abi/farm_router.abi.json";
import Contract from "./contract";

class FarmRouterContract extends Contract<typeof farmRouterAbi> {
    constructor(address: string) {
        super(address, farmRouterAbi);
    }
}

export default FarmRouterContract;
