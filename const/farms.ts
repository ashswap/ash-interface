import { IFarm } from "interface/farm";
import { ENVIRONMENT } from "./env";

const devnet: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq0ntze4q8fpqjd3hcdmd8np0yqw5zcxdzzh0qq2hjy9",
        reward_token_id: "ASH-f7c9ea",
        reward_token_decimal: 18,
        farming_token_id: "LPT-2897ed",
        farming_token_decimal: 18,
        farm_token_id: "FUU-2d3862",
        farm_token_decimal: 18,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq949vtp0lkshvgsvejznug4gh3v6px208zh0q39z00p",
        reward_token_id: "ASH-f7c9ea",
        reward_token_decimal: 18,
        farming_token_id: "LPT-4c3309",
        farming_token_decimal: 18,
        farm_token_id: "FBW-139340",
        farm_token_decimal: 18,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqcx652pqh8fya2weavz253ttznaltyx4zzh0qw5t4dm",
        reward_token_id: "ASH-f7c9ea",
        reward_token_decimal: 18,
        farming_token_id: "LPT-4236a8",
        farming_token_decimal: 18,
        farm_token_id: "FUU-4e0796",
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
