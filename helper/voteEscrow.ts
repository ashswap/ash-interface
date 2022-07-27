import BigNumber from "bignumber.js";
import { ASH_TOKEN, VE_ASH_DECIMALS } from "const/tokens";

export const estimateVeASH = (weiAmt: BigNumber, lockSeconds: number) => {
    // ratio: lock 1 ASH in 1 year(365 days) -> 0.25 veASH
    return weiAmt.multipliedBy(
        new BigNumber(0.25).multipliedBy(10 ** 20).div(365 * 24 * 60 * 60)
    ).multipliedBy(lockSeconds).multipliedBy(10 ** VE_ASH_DECIMALS).div(10 ** ASH_TOKEN.decimals).div(10 ** 20);
};