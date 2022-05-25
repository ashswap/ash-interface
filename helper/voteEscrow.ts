import BigNumber from "bignumber.js";
import { ENVIRONMENT } from "const/env";
import { ASH_TOKEN } from "const/tokens";
import { toEGLDD, toWei } from "./balance";

export const estimateVeASH = (weiAmt: BigNumber, lockSeconds: number) => {
    if (ENVIRONMENT.NETWORK === "devnet") {
        // ratio: lock 1 ASH in 2 weeks(14 days) -> 1 veASH
        const veASHPerS = toEGLDD(ASH_TOKEN.decimals, weiAmt).multipliedBy(
            new BigNumber(1).div(2 * 7 * 24 * 60 * 60)
        );
        return toWei(ASH_TOKEN, veASHPerS.multipliedBy(lockSeconds).toString());
    }
    // ratio: lock 1 ASH in 1 year(365 days) -> 0.25 veASH
    const veASHPerSecond = toEGLDD(ASH_TOKEN.decimals, weiAmt).multipliedBy(
        new BigNumber(0.25).div(365 * 24 * 60 * 60)
    );
    return toWei(
        ASH_TOKEN,
        veASHPerSecond.multipliedBy(lockSeconds).toString()
    );
};