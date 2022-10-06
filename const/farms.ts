import { IFarm } from "interface/farm";
import { ENVIRONMENT } from "./env";

type FarmConfig = {
    alpha: IFarm[];
    beta: IFarm[];
};
const devnet: FarmConfig = {
    beta: [
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqv753edtl0hzs6f06hjl8ez44kqjxja9crmcqzcg2av",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "LPT-02eb87",
            farming_token_decimal: 18,
            farm_token_id: "FUU-8159b6",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqungjzetn87wlc20asf7sy9ys9pu28a8grmcq695j4c",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "LPT-00e9fe",
            farming_token_decimal: 18,
            farm_token_id: "FUU-c100c6",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgq6n0f98ztf2w3rmdnp56yvftvt3sfmlthrmcqdu5shc",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "LPT-1b22d4",
            farming_token_decimal: 18,
            farm_token_id: "FUU-90625b",
            farm_token_decimal: 18,
            active: true,
        },
    ],
    alpha: [
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqqpw84dfpp8cwrtgd50zd3eney0vecq3grmcqghypzk",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "LPT-2d928d",
            farming_token_decimal: 18,
            farm_token_id: "FUU-eb55e6",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqqnwmxnamvr54uwqkfpuk8tsr7937rdeyrmcqy585pd",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "LPT-748bad",
            farming_token_decimal: 18,
            farm_token_id: "FUU-4c9c93",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqqc9ngahg667s0dlqhdfe5my0m70ls93grmcq66uhvj",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "LPT-bcdb19",
            farming_token_decimal: 18,
            farm_token_id: "FUU-1d49f2",
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
