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
                "erd1qqqqqqqqqqqqqpgqs3k5da877gswhkk4glq9jxecljtk8l9trmcqnw30ct",
            reward_token_id: "ASH-6969f1",
            reward_token_decimal: 18,
            farming_token_id: "LPT-1cb0dd",
            farming_token_decimal: 18,
            farm_token_id: "FUU-e3423a",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqt32x3zns22e9s6w62xa50ru2vtt5w5mrrmcqncx9f3",
            reward_token_id: "ASH-6969f1",
            reward_token_decimal: 18,
            farming_token_id: "LPT-554644",
            farming_token_decimal: 18,
            farm_token_id: "FUU-cc3b43",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqxxc4degqz6egjnje9tmnk6dlcrc3dxrkrmcqlmflqn",
            reward_token_id: "ASH-6969f1",
            reward_token_decimal: 18,
            farming_token_id: "LPT-840b08",
            farming_token_decimal: 18,
            farm_token_id: "FUU-25384d",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqej866y2rknq5lgjkph7970dzwazzt9z4rmcqg34dsy",
            reward_token_id: "ASH-6969f1",
            reward_token_decimal: 18,
            farming_token_id: "LPT-340989",
            farming_token_decimal: 18,
            farm_token_id: "FUU-0a569b",
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
