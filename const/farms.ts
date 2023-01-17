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
                "erd1qqqqqqqqqqqqqpgqjy6zu5p537yzcceh7v9ra7p8s8a65r94rmcqwkey3j",
            reward_token_id: "ASH-a0d8e5",
            reward_token_decimal: 18,
            farming_token_id: "LPT-a4b2f8",
            farming_token_decimal: 18,
            farm_token_id: "FUU-29ca73",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqpz4ahamu7fslhddtwqcfqx5ce0r00nearmcq9ldme6",
            reward_token_id: "ASH-a0d8e5",
            reward_token_decimal: 18,
            farming_token_id: "LPT-e52d68",
            farming_token_decimal: 18,
            farm_token_id: "FUU-511539",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqvwnjsnzm7drkhtgxsz65l6w53vze4utlrmcq4rl4uz",
            reward_token_id: "ASH-a0d8e5",
            reward_token_decimal: 18,
            farming_token_id: "LPT-d1b971",
            farming_token_decimal: 18,
            farm_token_id: "FUU-7ae157",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqj08cm7w7tljv3tmq0vxe8p9t09m6xvajrmcqfhu0t3",
            reward_token_id: "ASH-a0d8e5",
            reward_token_decimal: 18,
            farming_token_id: "LPT-9ef2ff",
            farming_token_decimal: 18,
            farm_token_id: "FUU-14f2fa",
            farm_token_decimal: 18,
            active: true,
        },
    ],
    beta: [
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgq0w3ceg72srdy5xacnlgy7v2083gm3vrqrmcqtmp497",
            reward_token_id: "ASH-77a5df",
            reward_token_decimal: 18,
            farming_token_id: "ALP-fc47a2",
            farming_token_decimal: 18,
            farm_token_id: "FARM-00609b",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqu47nsvmmkutxz6hk8hg958y3e0nsq5a5rmcqhj3quc",
            reward_token_id: "ASH-77a5df",
            reward_token_decimal: 18,
            farming_token_id: "LPT-820467",
            farming_token_decimal: 18,
            farm_token_id: "FUU-d16487",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqz2mclldgm9xz85f40l7llu3kv0xunddmrmcqg7mg2f",
            reward_token_id: "ASH-77a5df",
            reward_token_decimal: 18,
            farming_token_id: "LPT-2de32e",
            farming_token_decimal: 18,
            farm_token_id: "FUU-58274b",
            farm_token_decimal: 18,
            active: true,
        },
    ],
};

const mainnet: IFarm[] = [
    // {
    //     farm_address: "erd1qqqqqqqqqqqqqpgqcduxc8cysmrrvruxxr4tzsq5jzk5mr04tk2q9s5c2e",
    //     reward_token_id: "ASH-a85626",
    //     reward_token_decimal: 18,
    //     farming_token_id: "ALP-4df369",
    //     farming_token_decimal: 18,
    //     farm_token_id: "FARM-d246d5",
    //     farm_token_decimal: 18,
    //     active: true,
    // },
    // {
    //     farm_address: "erd1qqqqqqqqqqqqqpgq7w3kg4pcsrvxnak8hsflm3t3289m95phtk2q84fe4g",
    //     reward_token_id: "ASH-a85626",
    //     reward_token_decimal: 18,
    //     farming_token_id: "ALP-35a95f",
    //     farming_token_decimal: 18,
    //     farm_token_id: "FARM-b49d87",
    //     farm_token_decimal: 18,
    //     active: true,
    // },
    // {
    //     farm_address: "erd1qqqqqqqqqqqqqpgq0m4hwj4q68n5ftzq6ch65k0a5d4hwgaxtk2qavwsz4",
    //     reward_token_id: "ASH-a85626",
    //     reward_token_decimal: 18,
    //     farming_token_id: "ALP-d6fa8e",
    //     farming_token_decimal: 18,
    //     farm_token_id: "FARM-6cb669",
    //     farm_token_decimal: 18,
    //     active: true,
    // },
    // {
    //     farm_address: "erd1qqqqqqqqqqqqqpgqarq7tt3jnqcnqjc4n497m9sapx6mcjs4tk2qncp5lq",
    //     reward_token_id: "ASH-a85626",
    //     reward_token_decimal: 18,
    //     farming_token_id: "ALP-3e1426",
    //     farming_token_decimal: 18,
    //     farm_token_id: "FARM-323bfe",
    //     farm_token_decimal: 18,
    //     active: true,
    // },
    {
        farm_address: "erd1qqqqqqqqqqqqqpgq2qjtvyqd3qdnykdvwkz7nrx7faz0r680tk2qsps54p",
        reward_token_id: "ASH-a85626",
        reward_token_decimal: 18,
        farming_token_id: "ALP-8efbbe",
        farming_token_decimal: 18,
        farm_token_id: "FARM-f546e7",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address: "erd1qqqqqqqqqqqqqpgqryurefhn2aajq58jn0l9d3de802sv4q8tk2q3gjpdq",
        reward_token_id: "ASH-a85626",
        reward_token_decimal: 18,
        farming_token_id: "ALP-c011fd",
        farming_token_decimal: 18,
        farm_token_id: "FARM-86f286",
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
