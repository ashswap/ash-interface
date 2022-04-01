import { IFarm } from "interface/farm";
import { ENVIRONMENT } from "./env";

const devnet: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqtz6qslcc554ucayklltq4yk2pmy38a2ermcq56d660",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-a043fb",
        farming_token_decimal: 18,
        farm_token_id: "FUU-2d3862",
        farm_token_decimal: 18,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq7n02umscsw08atel35w2szgjsv2szhjxrmcqpmvl90",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-5b1224",
        farming_token_decimal: 18,
        farm_token_id: "FBW-139340",
        farm_token_decimal: 18,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqdprmfyhsuvm546x63a6uqk5w5u3gqzatrmcqtd0gl8",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-f11891",
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
