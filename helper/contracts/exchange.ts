import { Address } from "@elrondnetwork/erdjs/out";
import exchangeAbi from "assets/abi/exchange.abi.json";
import BigNumber from "bignumber.js";
import Contract from "./contract";

export type Order = {
    id: string;
    salt: BigNumber;
    kind: number;
    created_at: number;
    expire_time: number;
    owner_address: Address;
    owner_signature: string;
    buy_token: string;
    buy_amount: BigNumber;
    sell_token: string;
    sell_amount: BigNumber;
}
class ExchangeContract extends Contract {
    constructor(address: string) {
        super(address, exchangeAbi);
    }

    async executeExchange(takerOrder: Order, makerOrders: Order[]) {
        let interaction = this.contract.methods.executeExchange([takerOrder, ...makerOrders]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }
}

export default ExchangeContract;
