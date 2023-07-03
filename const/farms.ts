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
                "erd1qqqqqqqqqqqqqpgqpuzxdc6s6a8dhj7775t3yggscazd8dltrmcqdhqnnj",
            reward_token_id: "ASH-84eab0",
            reward_token_decimal: 18,
            farming_token_id: "ALP-cc035f",
            farming_token_decimal: 18,
            farm_token_id: "FARM-70529f",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqhafqpkzqvgxxy0kegfymh638vaxrz757rmcq6g8dt7",
            reward_token_id: "ASH-84eab0",
            reward_token_decimal: 18,
            farming_token_id: "ALP-543842",
            farming_token_decimal: 18,
            farm_token_id: "FARM-a9c942",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqyrtpnz6z5uk4s28vszdz3237fgwyjpa6rmcqw9fsaf",
            reward_token_id: "ASH-84eab0",
            reward_token_decimal: 18,
            farming_token_id: "ALP-6bb819",
            farming_token_decimal: 18,
            farm_token_id: "FARM-f439a4",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqmvsxh303khla7x83ll5gy6state082xermcqvg9fty",
            reward_token_id: "ASH-84eab0",
            reward_token_decimal: 18,
            farming_token_id: "ALP-193fb4",
            farming_token_decimal: 18,
            farm_token_id: "FARM-f0b336",
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
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgq4kv7uwgl074rxl2ykrnpk5ausdcp43rh2ges95w0tv",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-bf3d53",
            farming_token_decimal: 18,
            farm_token_id: "FARM-103481",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqnzpfy3htluj97knawphq7qy2jav2thpd2gesee7v8q",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-9836b4",
            farming_token_decimal: 18,
            farm_token_id: "FARM-f9c739",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqqqyaa0j3rtwg2zgl6fajglt4ajy228nh2gescfj5f8",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-278df8",
            farming_token_decimal: 18,
            farm_token_id: "FARM-0fd093",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgq8728urs5z6a6umfx2sekakyhagv9umul2gesc5m3j3",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-9471de",
            farming_token_decimal: 18,
            farm_token_id: "FARM-6f7051",
            farm_token_decimal: 18,
            active: true,
        },
    ],
};

const mainnet: IFarm[] = [
    {
        farm_address: "erd1qqqqqqqqqqqqqpgqfc3mgpq5m6lplrtmzv4vd46vyn7xy8ny2gesj0zmd9",
        reward_token_id: "ASH-a85626",
        reward_token_decimal: 18,
        farming_token_id: "ALP-c12752",
        farming_token_decimal: 18,
        farm_token_id: "FARM-ec77ff",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address: "erd1qqqqqqqqqqqqqpgqvfqexrv5cv28sgd2l2tx3vct4phc3k7e2ges3fee35",
        reward_token_id: "ASH-a85626",
        reward_token_decimal: 18,
        farming_token_id: "ALP-d935a5",
        farming_token_decimal: 18,
        farm_token_id: "FARM-bf2201",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address: "erd1qqqqqqqqqqqqqpgqmqx2ptfrz883xhwskurae4t5ya9t474r2ges87097v",
        reward_token_id: "ASH-a85626",
        reward_token_decimal: 18,
        farming_token_id: "ALP-c0b453",
        farming_token_decimal: 18,
        farm_token_id: "FARM-9aca13",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address: "erd1qqqqqqqqqqqqqpgq5rktlrxehpwalgplmj8hwl8mrk9p4x942gesk8tyxa",
        reward_token_id: "ASH-a85626",
        reward_token_decimal: 18,
        farming_token_id: "ALP-41fc41",
        farming_token_decimal: 18,
        farm_token_id: "FARM-09d6b0",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address: "erd1qqqqqqqqqqqqqpgqa8jv8m0tvspzd7cnl2kqp5dmzlgup0582gesd87uke",
        reward_token_id: "ASH-a85626",
        reward_token_decimal: 18,
        farming_token_id: "ALP-f47d16",
        farming_token_decimal: 18,
        farm_token_id: "FARM-3185cd",
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
