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
                "erd1qqqqqqqqqqqqqpgq6euk6n5av376vqg768z48zrv4fjxyw63rmcq8cgglq",
            reward_token_id: "ASH-77a5df",
            reward_token_decimal: 18,
            farming_token_id: "LPT-93bf25",
            farming_token_decimal: 18,
            farm_token_id: "FUU-ab98ef",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqpr26ag4qah8393ektrgemhtgfyxlfll4rmcqp5y5c4",
            reward_token_id: "ASH-77a5df",
            reward_token_decimal: 18,
            farming_token_id: "LPT-d6b19f",
            farming_token_decimal: 18,
            farm_token_id: "FUU-78ab31",
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
    ],
};

const mainnet: IFarm[] = [];

export const FARMS =
    (ENVIRONMENT.NETWORK == "devnet" ? devnet[ENVIRONMENT.ENV] : mainnet) || [];
export const ACTIVE_FARMS = FARMS.filter((f) => f.active);
export const FARMS_MAP = Object.fromEntries(
    FARMS.map((f) => [f.farm_address, f])
);
export const FARM_DIV_SAFETY_CONST = 1_000_000_000_000;
