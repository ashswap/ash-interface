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
                "erd1qqqqqqqqqqqqqpgq4nqhxjtrcdc0n7lj8jtkkl0k5rwtcwj5rmcq9m37we",
            reward_token_id: "ASH-84eab0",
            reward_token_decimal: 18,
            farming_token_id: "ALP-158b27",
            farming_token_decimal: 18,
            farm_token_id: "FARM-7db6e5",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqfhetr3q7rx8yeufat95k32wkj7dzr7chrmcqxwgfgj",
            reward_token_id: "ASH-84eab0",
            reward_token_decimal: 18,
            farming_token_id: "ALP-09e0cb",
            farming_token_decimal: 18,
            farm_token_id: "FARM-0a9395",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqmejjg59nzcs2g9ea0th6nxp8ummpkefurmcq00djne",
            reward_token_id: "ASH-84eab0",
            reward_token_decimal: 18,
            farming_token_id: "ALP-af2493",
            farming_token_decimal: 18,
            farm_token_id: "FARM-23f734",
            farm_token_decimal: 18,
            active: true,
        },
    ],
    beta: [
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqpr6tklrup3ld2z59jurcq94z8668uuey2ges9thxd2",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-9b7a73",
            farming_token_decimal: 18,
            farm_token_id: "FARM-0fc134",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgq2kt2w5v9k9swtm0hluqujg0xd9m99v9j2gesh7xjlz",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-6b7c94",
            farming_token_decimal: 18,
            farm_token_id: "FARM-249abc",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqx0jqq5s6f7g4pq8eh0lwu6wup58nj2262gesuuqkne",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-0e6b1c",
            farming_token_decimal: 18,
            farm_token_id: "FARM-dd9f39",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgq4vdzeaxmsrs2fpdnn3lvqh2akrx7av062geswx67ec",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-3c3066",
            farming_token_decimal: 18,
            farm_token_id: "FARM-f94a81",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqn65rsy79a9pml86jptyhaucz7w32j7jw2gesglrlz2",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-b9e453",
            farming_token_decimal: 18,
            farm_token_id: "FARM-9c3c87",
            farm_token_decimal: 18,
            active: true,
        },
    ],
};

const mainnet: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqe9hhqvvw9ssj6y388pf6gznwhuavhkzc4fvs0ra2fe",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-afc922",
        farming_token_decimal: 18,
        farm_token_id: "FARM-795466",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqf5awrqh68fra8rc7dnfrradadwsecrmc4fvsm6c2n7",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-5f9191",
        farming_token_decimal: 18,
        farm_token_id: "FARM-9ed1f9",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqq0ltmf7h456h5jlm8zn3utz0ap027wyk4fvs3yz9z0",
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
