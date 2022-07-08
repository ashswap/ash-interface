import { IFarm } from "interface/farm";
import { ENVIRONMENT } from "./env";

const devnet: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqjynk4kc89vhn8wg42fn6j6ny3t4k87nurmcqne35um",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-999601",
        farming_token_decimal: 18,
        farm_token_id: "FUU-368c44",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqsn5d6l90xnml6gh3lr2d8gft5kjssx85rmcqlexapt",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-ea941a",
        farming_token_decimal: 18,
        farm_token_id: "FUW-dd21b6",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqsxwkxy0eqzm30zx0cd0shk47kg3fe4drrmcqhekhv7",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-8860c3",
        farming_token_decimal: 18,
        farm_token_id: "FRW-dd4067",
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
