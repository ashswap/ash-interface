import BigNumber from "bignumber.js";
import { IESDTInfo } from "helper/token/token";

export interface TokenBalance {
    token: IESDTInfo;
    balance: BigNumber;
}

export interface TokenBalancesMap {
    [key: string]: TokenBalance;
}
