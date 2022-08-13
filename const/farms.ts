import { IFarm } from "interface/farm";
import { ENVIRONMENT } from "./env";

const devnet: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq6rscqc3e84us44nr27mzdhlqlhf6g0ptrmcq8hmmnr",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-9467c3",
        farming_token_decimal: 18,
        farm_token_id: "FUU-450457",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqut8cua5jf23nqa9jkhngrv3ppr6e6zcrrmcq646xrs",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-d50bed",
        farming_token_decimal: 18,
        farm_token_id: "FUU-fd8656",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqynyr26ryu046v3x0zxv6cn2sjjmkq2xarmcq7hgrz2",
        reward_token_id: "ASH-4ce444",
        reward_token_decimal: 18,
        farming_token_id: "LPT-3b7ee0",
        farming_token_decimal: 18,
        farm_token_id: "FUU-67343f",
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
