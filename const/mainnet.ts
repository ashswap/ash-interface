import BigNumber from "bignumber.js";
import { TokenAmount } from "helper/token/tokenAmount";
import { ENVIRONMENT } from "./env";
import { ASH_ESDT, VE_ASH_DECIMALS } from "./tokens";

export const REWARD_DISTRIBUTOR_CONTRACT =
    "erd1qqqqqqqqqqqqqpgqypydy4na5d3jjyxjr6m7mfrrev3kdhjxrmcquhxxtq";
export const LKASH_CONTRACT = ENVIRONMENT.NETWORK == "devnet" ? "erd1qqqqqqqqqqqqqpgqxsyrdj38fclflak2mwtqdknqzqhuxy4s0n4sc3e0jy" : "erd1qqqqqqqqqqqqqpgqawujux7w60sjhm8xdx3n0ed8v9h7kpqu2jpsecw6ek";
export const LK_ASH_COLLECTION = ENVIRONMENT.NETWORK == "devnet" ? "LKASH-261982" : "LKASH-10bd00";
export const TOTAL_REWARD_POOL = new TokenAmount(
    ASH_ESDT,
    new BigNumber(2_000_000).multipliedBy(10 ** ASH_ESDT.decimals)
);
export const LAUNCH_TS = 1676592000;
export const START_REWARD_POOL = 1674213600;
export const END_REWWARD_POOL = 1674216148;
export const UNLOCK_TS = 1674214200;// 1674432000;
export const REWARD_POOL_MIN_VE = new BigNumber(200).multipliedBy(
    10 ** VE_ASH_DECIMALS
);
export const LINK_PLAY_RULE = "https://medium.com/@ashswap/ash-staking-reward-pool-23bc3b45cee0";
