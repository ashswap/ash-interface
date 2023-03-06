import BigNumber from "bignumber.js";
import pools from "const/pool";
import { VE_MAX_TIME, WEEK } from "const/ve";
import { Fraction } from "helper/fraction/fraction";
import { TokenAmount } from "helper/token/tokenAmount";
import { estimateVeASH } from "helper/voteEscrow";
import moment from "moment";
import { atom, selector } from "recoil";
import { ashswapBaseState } from "./ashswap";

export const govLockedAmtSelector = selector<BigNumber>({
    key: "gov_locked_amt",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        return new BigNumber(
            base.votingEscrows[0]?.account?.locked?.amount || 0
        );
    },
});

export const govUnlockTSSelector = selector<BigNumber>({
    key: "gov_unlock_ts",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        return new BigNumber(
            base.votingEscrows[0]?.account?.locked?.end || moment().unix()
        );
    },
});

export const govPointSelector = selector({
    key: "gov_point",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        const amt = get(govLockedAmtSelector);
        const end = get(govUnlockTSSelector);
        const slope = amt.div(VE_MAX_TIME);
        const dt = end.minus(Math.floor(moment().unix() / WEEK) * WEEK);
        return {
            slope,
            bias: slope.multipliedBy(dt),
            end,
        };
    },
});

export const govTotalSupplyVeASHSelector = selector<BigNumber>({
    key: "gov_total_supply_veash",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        return new BigNumber(base.votingEscrows[0]?.veSupply || 0);
    },
});

export const govRewardLPTokenSelector = selector({
    key: "gov_reward_lp_token",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        return pools.find(
            (p) => p.lpToken.identifier === base.feeDistributor?.rewardToken.id
        );
    },
});

export const govRewardLPAmtSelector = selector<BigNumber>({
    key: "gov_reward_lp_amt",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        return new BigNumber(base.feeDistributor?.account?.reward || 0);
    },
});

export const govRewardLPValueSelector = selector({
    key: "gov_reward_lp_value",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        const rewardToken = get(govRewardLPTokenSelector)?.lpToken;
        if (!rewardToken) return new Fraction(0);
        const tokenAmount = new TokenAmount(
            rewardToken,
            base.feeDistributor?.account?.reward || 0
        ).multiply(
            Fraction.fromBigNumber(base.feeDistributor?.rewardToken.price || 0)
        );
        return tokenAmount;
    },
});

export const govTotalLockedAmtSelector = selector<BigNumber>({
    key: "gov_total_locked_amt",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        return new BigNumber(base.votingEscrows[0]?.totalLock || 0);
    },
});

export const govTotalLockedPctSelector = selector<number>({
    key: "gov_total_locked_pct",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        const totalLockedAmt = get(govTotalLockedAmtSelector);
        const totalSupply = new BigNumber(base.ashSupply);
        if (totalSupply.eq(0)) return 0;
        return totalLockedAmt.multipliedBy(100).div(totalSupply).toNumber();
    },
});

export const govVeASHAmtSelector = selector<BigNumber>({
    key: "gov_veash_amt_selector",
    get: ({ get }) => {
        const lockSecs = get(govUnlockTSSelector)
            .minus(moment().unix())
            .toNumber();
        const accLockedAmt = get(govLockedAmtSelector);
        return new BigNumber(
            lockSecs > 0 ? estimateVeASH(accLockedAmt, lockSecs) : 0
        );
    },
});
