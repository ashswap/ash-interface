import { IFarm } from "interface/farm";
import { ENVIRONMENT } from "./env";

const devnet: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqze4g0hcvp9usk9kqvpdcaehqu7ycav5szh0qz8wur9",
        reward_token_id: "ASH-f7c9ea",
        reward_token_decimal: 18,
        farming_token_id: "LPT-44f690",
        farming_token_decimal: 18,
        farm_token_id: "FUU-418b70",
        farm_token_decimal: 18,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqlaa4vmv6zcujzjrw2u0lqx8fy8hu45mlzh0qej9jya",
        reward_token_id: "ASH-f7c9ea",
        reward_token_decimal: 18,
        farming_token_id: "LPT-8f1594",
        farming_token_decimal: 18,
        farm_token_id: "FUW-f3b2c4",
        farm_token_decimal: 18,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqddh844m6y3e5qs08my0sl406p420nyu4zh0qxxtzxe",
        reward_token_id: "ASH-f7c9ea",
        reward_token_decimal: 18,
        farming_token_id: "LPT-0b4585",
        farming_token_decimal: 18,
        farm_token_id: "FRW-abd6e6",
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
