import BigNumber from "bignumber.js";
import { TokenAmount } from "helper/token/tokenAmount";
import { ASH_ESDT, VE_ASH_DECIMALS } from "./tokens";

export const REWARD_DISTRIBUTOR_CONTRACT =
    "erd1qqqqqqqqqqqqqpgqjfnu9jt6p4679nyw0xfwrqahfw6lje4xrmcqge6evj";
export const LKASH_CONTRACT = "erd1qqqqqqqqqqqqqpgqxsyrdj38fclflak2mwtqdknqzqhuxy4s0n4sc3e0jy";
export const LK_ASH_COLLECTION = "LKASH-261982";
export const TOTAL_REWARD_POOL = new TokenAmount(
    ASH_ESDT,
    new BigNumber(2_000_000).multipliedBy(10 ** ASH_ESDT.decimals)
);
export const LAUNCH_TS = 1676592000;
export const START_REWARD_POOL = 1674213600;
export const END_REWWARD_POOL = 1676649600;
export const UNLOCK_TS = 1674214200;// 1674432000;
export const REWARD_POOL_MIN_VE = new BigNumber(200).multipliedBy(
    10 ** VE_ASH_DECIMALS
);
