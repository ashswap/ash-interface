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
                "erd1qqqqqqqqqqqqqpgq0xlvg8aq2ufupue0msudrulcf5a77vw4rmcqq6v8c2",
            reward_token_id: "ASH-84eab0",
            reward_token_decimal: 18,
            farming_token_id: "ALP-466f16",
            farming_token_decimal: 18,
            farm_token_id: "FARM-d0fc82",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqt3h2uklsgw0mfgg692q4v9hsk7ke4s32rmcqguglhg",
            reward_token_id: "ASH-84eab0",
            reward_token_decimal: 18,
            farming_token_id: "ALP-f4f347",
            farming_token_decimal: 18,
            farm_token_id: "FARM-16faed",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqcfxgycr8jme8qmha2u43p7qp7g8lydscrmcqdwvtxv",
            reward_token_id: "ASH-84eab0",
            reward_token_decimal: 18,
            farming_token_id: "ALP-d01cf8",
            farming_token_decimal: 18,
            farm_token_id: "FARM-fb9cb3",
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
                "erd1qqqqqqqqqqqqqpgqaxqxp5vp53m9myd5gkv3qqsmsu55pfzu2gesancun2",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-34fed0",
            farming_token_decimal: 18,
            farm_token_id: "FARM-887ca0",
            farm_token_decimal: 18,
            active: true,
        },
    ],
};

const mainnet: IFarm[] = [
    {
        farm_address: "erd1qqqqqqqqqqqqqpgqe9hhqvvw9ssj6y388pf6gznwhuavhkzc4fvs0ra2fe",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-afc922",
        farming_token_decimal: 18,
        farm_token_id: "FARM-795466",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address: "erd1qqqqqqqqqqqqqpgqf5awrqh68fra8rc7dnfrradadwsecrmc4fvsm6c2n7",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-5f9191",
        farming_token_decimal: 18,
        farm_token_id: "FARM-9ed1f9",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address: "erd1qqqqqqqqqqqqqpgqq0ltmf7h456h5jlm8zn3utz0ap027wyk4fvs3yz9z0",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-2d0cf8",
        farming_token_decimal: 18,
        farm_token_id: "FARM-e5ffde",
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
