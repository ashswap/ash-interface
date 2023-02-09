import { Address } from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import { ElrondStruct, ElrondType } from "./elrond";

export interface IFarm {
    farm_address: string;
    reward_token_id: string;
    reward_token_decimal: number;
    farming_token_id: string;
    farming_token_decimal: number;
    farm_token_id: string;
    farm_token_decimal: number;
    active: boolean;
}

export interface FarmAdditionalReward {
    token: string;
    reward_per_share: BigNumber;
}

export interface FarmTokenAttrs {
    reward_per_share: BigNumber;
    slope_used: BigNumber;
    booster: Address;
    // after boost amount of token
    initial_farm_amount: BigNumber;
    // real input token for boosting -> boost = initial_farm_amount / initial_farming_amount
    initial_farming_amount: BigNumber;
    reward_tokens: FarmAdditionalReward[]
}

export interface FarmBoostInfo {
    boost: number;
    veForBoost: BigNumber;
}

export const FarmTokenAttrsStruct: ElrondStruct<FarmTokenAttrs> = {
    "1_reward_per_share": ElrondType.BIG_UINT,
    "2_slope_used": ElrondType.BIG_UINT,
    "3_booster": ElrondType.MANAGED_ADDRESS,
    "4_initial_farm_amount": ElrondType.BIG_UINT,
    "5_initial_farming_amount": ElrondType.BIG_UINT,
    "6_reward_tokens": ElrondType.BIG_UINT
};
