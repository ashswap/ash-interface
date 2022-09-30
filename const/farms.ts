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
                "erd1qqqqqqqqqqqqqpgqzn3pajclsq0r6l0r6lwtk6eex4tvukz6rmcqev7zru",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "LPT-e94e61",
            farming_token_decimal: 18,
            farm_token_id: "FUU-e1fd17",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqph056kt5sleala0vu7phyvsp4gjtrjzdrmcqmlknkq",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "LPT-bd1ee9",
            farming_token_decimal: 18,
            farm_token_id: "FUU-a770fd",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgq9wdqq66lg5erhc9ga7h6l4vru98p3skvrmcqpde2p3",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "LPT-66c89c",
            farming_token_decimal: 18,
            farm_token_id: "FUU-24dfff",
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
