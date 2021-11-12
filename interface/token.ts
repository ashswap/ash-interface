import BigNumber from "bignumber.js";

export interface IToken {
    id: string;
    icon: string;
    name: string;
    decimals: number;
    totalSupply?: BigNumber;
}

export interface ITokenMap {
    [key: string]: IToken;
}
