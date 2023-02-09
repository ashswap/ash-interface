import BigNumber from "bignumber.js";
import pools from "const/pool";
import { VE_MAX_TIME, WEEK } from "const/ve";
import { Fraction } from "helper/fraction/fraction";
import { TokenAmount } from "helper/token/tokenAmount";
import moment from "moment";
import { atom, selector } from "recoil";
import { ashswapBaseState } from "./ashswap";

export const govTotalLockedPctState = atom<number>({
    key: "gov_total_locked_pct",
    default: 0,
});

export const govVeASHAmtState = atom<BigNumber>({
    key: "gov_veash_amt",
    default: new BigNumber(0),
});

export const govLockedAmtState = selector<BigNumber>({
    key: "gov_locked_amt",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        return new BigNumber(
            base.votingEscrows[0]?.account?.locked?.amount || 0
        );
    },
});

export const govUnlockTSState = selector<BigNumber>({
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
    get: ({get}) => {
        const base = get(ashswapBaseState);
        const amt = get(govLockedAmtState);
        const end = get(govUnlockTSState);
        const slope = amt.div(VE_MAX_TIME);
        const dt = end.minus(Math.floor(moment().unix() / WEEK) * WEEK)
        return {
            slope,
            bias: slope.multipliedBy(dt),
            end
        }
    }
})

export const govTotalSupplyVeASH = selector<BigNumber>({
    key: "gov_total_supply_veash",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        return new BigNumber(base.votingEscrows[0]?.veSupply || 0);
    },
});

export const govRewardLPTokenState = selector({
    key: "gov_reward_lp_token",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        return pools.find(
            (p) => p.lpToken.identifier === base.feeDistributor?.rewardToken.id
        );
    },
});

export const govRewardLPAmtState = selector<BigNumber>({
    key: "gov_reward_lp_amt",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        return new BigNumber(base.feeDistributor?.account?.reward || 0);
    },
});

export const govRewardLPValueState = selector({
    key: "gov_reward_lp_value",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        const rewardToken = get(govRewardLPTokenState)?.lpToken;
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

export const govTotalLockedAmtState = selector<BigNumber>({
    key: "gov_total_locked_amt",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        return new BigNumber(base.votingEscrows[0]?.totalLock || 0);
    },
});
