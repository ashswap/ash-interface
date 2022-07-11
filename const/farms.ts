import { IFarm } from "interface/farm";
import { ENVIRONMENT } from "./env";

const devnet: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq6rscqc3e84us44nr27mzdhlqlhf6g0ptrmcq8hmmnr",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-9467c3",
        farming_token_decimal: 18,
        farm_token_id: "FUU-450457",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqut8cua5jf23nqa9jkhngrv3ppr6e6zcrrmcq646xrs",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-d50bed",
        farming_token_decimal: 18,
        farm_token_id: "FUU-fd8656",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqynyr26ryu046v3x0zxv6cn2sjjmkq2xarmcq7hgrz2",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-3b7ee0",
        farming_token_decimal: 18,
        farm_token_id: "FUU-67343f",
        farm_token_decimal: 18,
        active: true,
    },
];

const testnet: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqacmmcl4k59f6hya4yaqftt87608f8w9sj9tsm6sk4l",
        reward_token_id: "ASH-f01858",
        reward_token_decimal: 18,
        farming_token_id: "LPT-f0204d",
        farming_token_decimal: 18,
        farm_token_id: "FUT-5b9f1c",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq2ztrl87upm97zceq482kd00dsd5t2cs4j9tsuzjk3x",
        reward_token_id: "ASH-f01858",
        reward_token_decimal: 18,
        farming_token_id: "LPT-2acb85",
        farming_token_decimal: 18,
        farm_token_id: "FBB-658d06",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqzl43aajpvlvt3r2jk5pm4hu0vy8yx0x6j9tscfsr2l",
        reward_token_id: "ASH-f01858",
        reward_token_decimal: 18,
        farming_token_id: "LPT-75f818",
        farming_token_decimal: 18,
        farm_token_id: "FUU-3112e6",
        farm_token_decimal: 18,
        active: true,
    },
];

export const FARMS = ENVIRONMENT.NETWORK == "devnet" ? devnet : testnet;
export const ACTIVE_FARMS = FARMS.filter((f) => f.active);
export const FARMS_MAP = Object.fromEntries(
    FARMS.map((f) => [f.farm_address, f])
);
export const FARM_DIV_SAFETY_CONST = 1_000_000_000_000;
