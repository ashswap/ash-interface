import routerAbi from "assets/abi/router.abi.json";
import Contract from "./contract";

class RouterContract extends Contract<typeof routerAbi> {
    constructor(address: string) {
        super(address, routerAbi);
    }
}

export default RouterContract;
