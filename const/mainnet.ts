import BigNumber from "bignumber.js";
import { TokenAmount } from "helper/token/tokenAmount";
import { ASH_ESDT, VE_ASH_DECIMALS } from "./tokens";

export const REWARD_POOL_CONTRACT = "";
export const LKASH_CONTRACT = "";
export const TOTAL_REWARD_POOL = new TokenAmount(ASH_ESDT, new BigNumber(2_000_000).multipliedBy(10**ASH_ESDT.decimals));
export const LAUNCH_TS = 1676592000;
export const START_REWARD_POOL = 1674313200;
export const END_REWWARD_POOL = 1676649600;
export const REWARD_POOL_MIN_VE = new BigNumber(625).multipliedBy(10**VE_ASH_DECIMALS);
