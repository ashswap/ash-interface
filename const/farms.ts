import { IFarm } from "interface/farm";
import { ENVIRONMENT } from "./env";

type FarmConfig = {
    dev: IFarm[];
    test: IFarm[];
};
const devnet: FarmConfig = {
    dev: [
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
    ],
    test: [
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgq87sx2a9z2536sy5jfe7mh0a62t2lal47rmcq89jaam",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "LPT-e94e61",
            farming_token_decimal: 18,
            farm_token_id: "FUU-0e0d35",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqwsjx3mpp6aw878ha3pqtr9hh5ru6xpuzrmcqscuf62",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "LPT-bd1ee9",
            farming_token_decimal: 18,
            farm_token_id: "FUU-1d6211",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqc98ptyxnfg4ftnhyqfv2sexqrzntmlx0rmcq22ua8j",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "LPT-66c89c",
            farming_token_decimal: 18,
            farm_token_id: "FUU-51b0f9",
            farm_token_decimal: 18,
            active: true,
        },
    ],
};

const testnet: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqprth95wg7zlzuuaghq35xa50vdtrwch4j9tsehcmef",
        reward_token_id: "ASH-f01858",
        reward_token_decimal: 18,
        farming_token_id: "LPT-9cf3ed",
        farming_token_decimal: 18,
        farm_token_id: "FUU-d0a632",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqfyyvh9jy5wq90hgvyszr3clewy9uvjrgj9tskfjhpj",
        reward_token_id: "ASH-f01858",
        reward_token_decimal: 18,
        farming_token_id: "LPT-d1e2b6",
        farming_token_decimal: 18,
        farm_token_id: "FUU-b0a310",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqfj4m5yfr3hnq285ucrk6hc2pwhf6gfcvj9tsqh6a8q",
        reward_token_id: "ASH-f01858",
        reward_token_decimal: 18,
        farming_token_id: "LPT-643463",
        farming_token_decimal: 18,
        farm_token_id: "FUU-b0138e",
        farm_token_decimal: 18,
        active: true,
    },
];

export const FARMS =
    (ENVIRONMENT.NETWORK == "devnet" ? devnet[ENVIRONMENT.ENV] : testnet) || [];
export const ACTIVE_FARMS = FARMS.filter((f) => f.active);
export const FARMS_MAP = Object.fromEntries(
    FARMS.map((f) => [f.farm_address, f])
);
export const FARM_DIV_SAFETY_CONST = 1_000_000_000_000;
