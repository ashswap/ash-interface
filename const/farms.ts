import { IFarm } from "interface/farm";
import { ENVIRONMENT } from "./env";

type FarmConfig = {
    alpha: IFarm[];
    beta: IFarm[];
};
const devnet: FarmConfig = {
    alpha: [
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqmsf5dxfneelefv77swmej6ct33daeec2rmcq3ud73d",
            reward_token_id: "ASH-84eab0",
            reward_token_decimal: 18,
            farming_token_id: "ALP-a3ac6b",
            farming_token_decimal: 18,
            farm_token_id: "FARM-8d70ae",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqkwx97wpe2hqmucd3qezvr6udea0eddnlrmcqm8q46t",
            reward_token_id: "ASH-84eab0",
            reward_token_decimal: 18,
            farming_token_id: "ALP-d531b5",
            farming_token_decimal: 18,
            farm_token_id: "FARM-2a18d1",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqkw56zju85a707k96u3dqutjn5a3acuyprmcqh0drk5",
            reward_token_id: "ASH-84eab0",
            reward_token_decimal: 18,
            farming_token_id: "ALP-30ef76",
            farming_token_decimal: 18,
            farm_token_id: "FARM-f21afb",
            farm_token_decimal: 18,
            active: true,
        },
    ],
    beta: [
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgq84grnrns73p28kkp9mu5v2dl5vclpq6r2gesn5hz4s",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-c874cd",
            farming_token_decimal: 18,
            farm_token_id: "FARM-c4c5ef",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgq6cc8e07q28z3r9aemnn68x9pu8funw462gesh3p8qv",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-36485d",
            farming_token_decimal: 18,
            farm_token_id: "FARM-6fb37f",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgq8ar2tjxdk04t6rdhdxm74rpy04d3l5lm2gesep69np",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-48f785",
            farming_token_decimal: 18,
            farm_token_id: "FARM-19b7b1",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqkhdl37ctu8wvht2am6lrgd2s7lvkvq0x2gesju2nvt",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-44bcf0",
            farming_token_decimal: 18,
            farm_token_id: "FARM-88e863",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqytrjkljp9k3fvqmze6qfpeyjx24dqkuj2gese9pp84",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-a3a2f6",
            farming_token_decimal: 18,
            farm_token_id: "FARM-6d2b86",
            farm_token_decimal: 18,
            active: true,
        },
    ],
};

const mainnet: IFarm[] = [
    {
        farm_address: "erd1qqqqqqqqqqqqqpgqfc3mgpq5m6lplrtmzv4vd46vyn7xy8ny2gesj0zmd9",
        reward_token_id: "ASH-a85626",
        reward_token_decimal: 18,
        farming_token_id: "ALP-c12752",
        farming_token_decimal: 18,
        farm_token_id: "FARM-ec77ff",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address: "erd1qqqqqqqqqqqqqpgqvfqexrv5cv28sgd2l2tx3vct4phc3k7e2ges3fee35",
        reward_token_id: "ASH-a85626",
        reward_token_decimal: 18,
        farming_token_id: "ALP-d935a5",
        farming_token_decimal: 18,
        farm_token_id: "FARM-bf2201",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address: "erd1qqqqqqqqqqqqqpgqmqx2ptfrz883xhwskurae4t5ya9t474r2ges87097v",
        reward_token_id: "ASH-a85626",
        reward_token_decimal: 18,
        farming_token_id: "ALP-c0b453",
        farming_token_decimal: 18,
        farm_token_id: "FARM-9aca13",
        farm_token_decimal: 18,
        active: true,
    },
];

export const FARMS =
    (ENVIRONMENT.NETWORK == "devnet" ? devnet[ENVIRONMENT.ENV] : mainnet) || [];
export const ACTIVE_FARMS = FARMS.filter((f) => f.active);
export const FARMS_MAP = Object.fromEntries(
    FARMS.map((f) => [f.farm_address, f])
);
export const FARM_DIV_SAFETY_CONST = 1_000_000_000_000;
