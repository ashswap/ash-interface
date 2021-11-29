import BigNumber from "bignumber.js";

export interface IToken {
    id: string;
    icon: string | StaticImageData;
    name: string;
    decimals: number;
    totalSupply?: BigNumber;
    coingeckoId?: string;
}

export interface ITokenMap {
    [key: string]: IToken;
}
