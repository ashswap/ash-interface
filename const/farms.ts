import { IFarm } from "interface/farm";
import { ENVIRONMENT } from "./env";

const devnet: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqm9h0q4zzr397u7duh78j6mwyu0fx2fcyzh0qnpdqwe",
        reward_token_id: "ASH-f7c9ea",
        reward_token_decimal: 18,
        farming_token_id: "LPT-d6d2a2",
        farming_token_decimal: 18,
        farm_token_id: "FUU-c50d65",
        farm_token_decimal: 18,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqgcq9jkdwyvjh9pnekr8xy6ytsvv2gpmkzh0q63t9dg",
        reward_token_id: "ASH-f7c9ea",
        reward_token_decimal: 18,
        farming_token_id: "LPT-5448e9",
        farming_token_decimal: 18,
        farm_token_id: "FUW-69b4e8",
        farm_token_decimal: 18,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqna7kmhzaeu704tpgwjec5sk9xt69fv0wzh0q3m2c4e",
        reward_token_id: "ASH-f7c9ea",
        reward_token_decimal: 18,
        farming_token_id: "LPT-58c291",
        farming_token_decimal: 18,
        farm_token_id: "FRW-f36b62",
        farm_token_decimal: 18,
    },
];

const testnet: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqrn64ujp5m8c6l2k58v7qgtn8f48u6d29j9ts27qugg",
        reward_token_id: "ASH-76f082",
        reward_token_decimal: 18,
        farming_token_id: "LPT-89ce1b",
        farming_token_decimal: 18,
        farm_token_id: "FUU-0cf97f",
        farm_token_decimal: 18,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq586kxhrjyy9wn5ye4zlzrt3qumj6zvpsj9ts0zf4ss",
        reward_token_id: "ASH-76f082",
        reward_token_decimal: 18,
        farming_token_id: "LPT-907366",
        farming_token_decimal: 18,
        farm_token_id: "FBW-605801",
        farm_token_decimal: 18,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqypv50s28r49av8fwrgrrtgha840j37auj9tskgdd6t",
        reward_token_id: "ASH-76f082",
        reward_token_decimal: 18,
        farming_token_id: "LPT-a56ef1",
        farming_token_decimal: 18,
        farm_token_id: "FUU-7abb62",
        farm_token_decimal: 18,
    },
];

export const FARMS = ENVIRONMENT.NETWORK == "devnet" ? devnet : testnet;
