import BigNumber from "bignumber.js";
import IToken from "./token";

export default interface TokenBalance {
    token: IToken
    balance: BigNumber
}