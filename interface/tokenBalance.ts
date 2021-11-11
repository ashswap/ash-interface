import BigNumber from "bignumber.js";
import { IToken } from "./token";

export interface TokenBalance {
    token: IToken;
    balance: BigNumber;
}

export interface TokenBalancesMap {
    [key: string]: TokenBalance;
}
