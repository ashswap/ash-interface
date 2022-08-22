import { IFarm } from "interface/farm";
import { ENVIRONMENT } from "./env";

const devnet: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq6cte98kfd6g7xnwp3je9q89q96l5mxcyrmcqd0n7u3",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-02bf1a",
        farming_token_decimal: 18,
        farm_token_id: "FUU-50b198",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqkchcqxnhlutshtsved64efq2tkvydxs9rmcqnjdgkj",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-fb4d45",
        farming_token_decimal: 18,
        farm_token_id: "FUU-c217eb",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqf2jc858yhnq3p7de25z9uz2e3f7c7qcgrmcq222669",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-fd847c",
        farming_token_decimal: 18,
        farm_token_id: "FUU-7a69c6",
        farm_token_decimal: 18,
        active: true,
    },
];

const testnet: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq020sseekwgxka9jjjm9rauwskw7nzzpnj9tsqr6vvp",
        reward_token_id: "ASH-f01858",
        reward_token_decimal: 18,
        farming_token_id: "LPT-3959c7",
        farming_token_decimal: 18,
        farm_token_id: "FUU-589943",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqt4qnlp7qxkq5dwqrvn0c3r6jct96h0cvj9tsep3fvp",
        reward_token_id: "ASH-f01858",
        reward_token_decimal: 18,
        farming_token_id: "LPT-231a1f",
        farming_token_decimal: 18,
        farm_token_id: "FUW-d3664e",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqtaeul32plq0asdh2u3lh4jgcnsc98mkxj9tsul75t3",
        reward_token_id: "ASH-f01858",
        reward_token_decimal: 18,
        farming_token_id: "LPT-a51712",
        farming_token_decimal: 18,
        farm_token_id: "FBB-d8bc0a",
        farm_token_decimal: 18,
        active: true,
    },
];

export const FARMS = ENVIRONMENT.NETWORK == "devnet" ? devnet : testnet;
export const ACTIVE_FARMS = FARMS.filter((f) => f.active);
export const FARMS_MAP = Object.fromEntries(
    FARMS.map((f) => [f.farm_address, f])
);
export const FARM_DIV_SAFETY_CONST = 1_000_000_000_000;
