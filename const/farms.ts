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
                "erd1qqqqqqqqqqqqqpgq27l8nqlweh3jelnhe553a28u3unfnjve2ges45tqwm",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-90ac4b",
            farming_token_decimal: 18,
            farm_token_id: "FARM-19a8e6",
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
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqk0mgg8s6ute3e4vyxhmy0jj60lyp552q2gesmemxaj",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-f881e3",
            farming_token_decimal: 18,
            farm_token_id: "FARM-831730",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqwxtftcajgwc4ezdltyaljsc6dpcjzms72gesvnqe7w",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-bddc86",
            farming_token_decimal: 18,
            farm_token_id: "FARM-c9dabc",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqdmy23674hul2yfakvxk34wzcz8k022r92ges5pv9r0",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-05cdde",
            farming_token_decimal: 18,
            farm_token_id: "FARM-ca9be8",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqmkthed2w5nlq94e2qmfx2knp7wd9vjy32ges4wlqxp",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-433b26",
            farming_token_decimal: 18,
            farm_token_id: "FARM-11616d",
            farm_token_decimal: 18,
            active: true,
        },
        {
            farm_address:
                "erd1qqqqqqqqqqqqqpgqa58dauh7pjzmn8ww0gp8skjrqs798j0a2ges42sd8q",
            reward_token_id: "ASH-4ce444",
            reward_token_decimal: 18,
            farming_token_id: "ALP-7304b9",
            farming_token_decimal: 18,
            farm_token_id: "FARM-3d8566",
            farm_token_decimal: 18,
            active: true,
        },
    ],
};

const devnet2: IFarm[] = [
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq879numpf7hxlh9kvuwmzk5cpjek922s92gesm69xqh",
        reward_token_id: "ASH-e3d1b7",
        reward_token_decimal: 18,
        farming_token_id: "ALP-a89380",
        farming_token_decimal: 18,
        farm_token_id: "FARM-52ee15",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqtfcul8mu2pgyamr8j7mhpkgxqma55zpe2geswxtny8",
        reward_token_id: "ASH-e3d1b7",
        reward_token_decimal: 18,
        farming_token_id: "ALP-20e461",
        farming_token_decimal: 18,
        farm_token_id: "FARM-26f2b6",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqqvz5ud0zz7uetj9u3003dht8u7wvpw3v2geskvamv3",
        reward_token_id: "ASH-e3d1b7",
        reward_token_decimal: 18,
        farming_token_id: "ALP-8817f1",
        farming_token_decimal: 18,
        farm_token_id: "FARM-a0057a",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq6ykvw09a5mext8y4new4wk90jt9p8pyx2geszugdq7",
        reward_token_id: "ASH-e3d1b7",
        reward_token_decimal: 18,
        farming_token_id: "ALP-caeac5",
        farming_token_decimal: 18,
        farm_token_id: "FARM-0eaf02",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq9aekflg9ju993kk55rdru7e7qkm3xyeg2geseaaxkk",
        reward_token_id: "ASH-e3d1b7",
        reward_token_decimal: 18,
        farming_token_id: "ALP-097c45",
        farming_token_decimal: 18,
        farm_token_id: "FARM-c0c56e",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqxe0xjvyttytj9tjjp4mmsr40rmn9wssn2ges0c3uq5",
        reward_token_id: "ASH-e3d1b7",
        reward_token_decimal: 18,
        farming_token_id: "ALP-7f4b3f",
        farming_token_decimal: 18,
        farm_token_id: "FARM-3f45f0",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq52d3e2u7ugk56avycqx849a8pzvpnus62ges0wj9yw",
        reward_token_id: "ASH-e3d1b7",
        reward_token_decimal: 18,
        farming_token_id: "ALP-e4391a",
        farming_token_decimal: 18,
        farm_token_id: "FARM-282abb",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqemrc50rnk9jw8fmx39el4lhwk0duenxl2gesw530y3",
        reward_token_id: "ASH-e3d1b7",
        reward_token_decimal: 18,
        farming_token_id: "ALP-3763b9",
        farming_token_decimal: 18,
        farm_token_id: "FARM-a2ddfd",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq6x6975vtja2wvvdjg6d0jr6yvjjwqma42gesfaeus4",
        reward_token_id: "ASH-e3d1b7",
        reward_token_decimal: 18,
        farming_token_id: "ALP-2be5ea",
        farming_token_decimal: 18,
        farm_token_id: "FARM-a4caae",
        farm_token_decimal: 18,
        active: true,
    },
];

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
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqlxrx76w63v6zp4gh0rpexe7hhjnz63244fvs6xzgrd",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-0fe50a",
        farming_token_decimal: 18,
        farm_token_id: "FARM-ccefc2",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqnj9cqltcj8hhjxj96ky3e98qk5hv9d7y4fvsvx43mv",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-f7dee1",
        farming_token_decimal: 18,
        farm_token_id: "FARM-83c131",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq5dg773v5n2aulmec4pp7cn7gdnyjjq5v4fvsaah2r8",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-713ae8",
        farming_token_decimal: 18,
        farm_token_id: "FARM-b637f0",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqfa28799n3yt5lrzt75lgvqfz4jxsf2ef4fvs7rkgzy",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-796121",
        farming_token_decimal: 18,
        farm_token_id: "FARM-13ebe8",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqfuvnm89cv9f9t5r5e3steuwevvzyhq7n4fvs9k5m6s",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-d97011",
        farming_token_decimal: 18,
        farm_token_id: "FARM-21eb93",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqdslmlzqra5x3dvztkfm7a7atvty8ewxs4fvsw4xgj0",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-0ed700",
        farming_token_decimal: 18,
        farm_token_id: "FARM-2f6e3d",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqa8w5k3rx6zwwfjms8ydpw0aty5w6sw6n4fvsqq0m2x",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-2265f4",
        farming_token_decimal: 18,
        farm_token_id: "FARM-e1e69d",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqf302rtksxdu0h6caulv2s6pp6xses2704fvs0r3x8z",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-deda92",
        farming_token_decimal: 18,
        farm_token_id: "FARM-d7ceeb",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqlzksd2k9drsm0gfdd832zn4gpela33p44fvs7qs3lk",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-fe21d9",
        farming_token_decimal: 18,
        farm_token_id: "FARM-5537a8",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqkhr07h7w0mwcswhjhuhprp64ghskj6vs4fvsznn4dg",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-20179e",
        farming_token_decimal: 18,
        farm_token_id: "FARM-0cb2e7",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgq8f37dnwfupxpsh3l2refpf3g5pw7fmv94fvsfyjt30",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-487964",
        farming_token_decimal: 18,
        farm_token_id: "FARM-4e19fe",
        farm_token_decimal: 18,
        active: true,
    },
    {
        farm_address:
            "erd1qqqqqqqqqqqqqpgqh8jkktrts7qujjyhvw53lhu9egxy7yrv4fvsc9lwy8",
        reward_token_id: "ASH-a642d1",
        reward_token_decimal: 18,
        farming_token_id: "ALP-0f46fa",
        farming_token_decimal: 18,
        farm_token_id: "FARM-263009",
        farm_token_decimal: 18,
        active: true,
    },
];

export const FARMS =
    (ENVIRONMENT.NETWORK == "devnet"
        ? devnet[ENVIRONMENT.ENV]
        : ENVIRONMENT.NETWORK == "devnet2"
        ? devnet2
        : mainnet) || [];
export const ACTIVE_FARMS = FARMS.filter((f) => f.active);
export const FARMS_MAP = Object.fromEntries(
    FARMS.map((f) => [f.farm_address, f])
);
export const FARM_DIV_SAFETY_CONST = 1_000_000_000_000;
