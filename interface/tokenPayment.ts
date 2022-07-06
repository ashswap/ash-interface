import BigNumber from "bignumber.js";

export interface TokenPayment {
    tokenId: string;
    nonce: number;
    amount: BigNumber;
    collection?: string;
}