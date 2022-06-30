import BigNumber from "bignumber.js";
import { CHAIN_ID } from "const/dappConfig";
import { ValueOf } from "./utilities";

export interface IToken {
    id: string;
    chainId: ValueOf<typeof CHAIN_ID>;
    icon: string | StaticImageData;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply?: BigNumber;
    coingeckoId?: string;
    projectLink?: string;
}

export interface ITokenMap {
    [key: string]: IToken;
}
