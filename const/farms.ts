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
            "erd1qqqqqqqqqqqqqpgqx4r0q39p7wky6a5pe5q90p7v307xyzr7j9tsrhtlv7",
        reward_token_id: "ASH-f01858",
        reward_token_decimal: 18,
        farming_token_id: "LPT-f0204d",
        farming_token_decimal: 18,
        farm_token_id: "FUU-6bd7c3",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqp6f23d64tefj95uwhey0wt3r2dwuzd5yj9tsjc4yqg",
        reward_token_id: "ASH-f01858",
        reward_token_decimal: 18,
        farming_token_id: "LPT-2acb85",
        farming_token_decimal: 18,
        farm_token_id: "FUW-2b7274",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq0fagpquk0hpxq50q48spex5nzx4ehqmpj9tsgywm64",
        reward_token_id: "ASH-f01858",
        reward_token_decimal: 18,
        farming_token_id: "LPT-75f818",
        farming_token_decimal: 18,
        farm_token_id: "FRW-857544",
        farm_token_decimal: 18,
        active: true,
    },
];

export const FARMS = ENVIRONMENT.NETWORK == "devnet" ? devnet : testnet;
export const ACTIVE_FARMS = FARMS.filter(f => f.active);
export const FARMS_MAP = Object.fromEntries(FARMS.map(f => [f.farm_address, f]));
