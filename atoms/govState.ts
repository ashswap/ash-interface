import BigNumber from "bignumber.js";
import IPool from "interface/pool";
import { atom } from "recoil";

export const govLockedAmtState = atom<BigNumber>({
    key: "gov_locked_amt",
    default: new BigNumber(0),
});

export const govTotalLockedAmtState = atom<BigNumber>({
    key: "gov_total_locked_amt",
    default: new BigNumber(0),
});

export const govVeASHAmtState = atom<BigNumber>({
    key: "gov_veash_amt",
    default: new BigNumber(0),
});

export const govUnlockTSState = atom<BigNumber>({
    key: "gov_unlock_ts",
    default: new BigNumber(0),
});

export const govTotalSupplyVeASH = atom<BigNumber>({
    key: "gov_total_supply_veash",
    default: new BigNumber(0),
});

export const govTotalLockedPctState = atom<number>({
    key: "gov_total_locked_pct",
    default: 0,
});

export const govRewardLPAmtState = atom<BigNumber>({
    key: "gov_reward_lp_amt",
    default: new BigNumber(0),
});

export const govRewardLPValueState = atom<BigNumber>({
    key: "gov_reward_lp_value",
    default: new BigNumber(0),
});

export const govRewardLPTokenState = atom<IPool>({
    key: "gov_reward_lp_token",
    default: undefined
});
