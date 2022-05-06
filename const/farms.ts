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
