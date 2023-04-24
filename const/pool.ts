import { ChainId, IESDTInfo } from "helper/token/token";
import IPool, { EPoolType } from "interface/pool";
import { ENVIRONMENT } from "./env";
import { MAIAR_POOLS } from "./maiarPools";
import { TOKENS_MAP } from "./tokens";
import { WRAPPED_EGLD } from "./wrappedEGLD";

type PoolConfig = {
    beta: IPool[];
    alpha: IPool[];
};
const devnet: PoolConfig = {
    alpha: [
        {
            address:
                "erd1qqqqqqqqqqqqqpgq2tfpxjad737gz8y8vk5ccaqucc4lpngprmcq8ee66a",
            lpToken: TOKENS_MAP["ALP-cc035f"],
            tokens: [
                TOKENS_MAP["USDC-fd47e9"],
                TOKENS_MAP["USDT-3e3720"],
                TOKENS_MAP["BUSD-b53884"],
            ],
            type: EPoolType.PlainPool,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgq8naz58m5vvm7054crz0cusx5djeuuhzsrmcq8klglz",
            lpToken: TOKENS_MAP["ALP-543842"],
            tokens: [TOKENS_MAP["WEGLD-578a26"], TOKENS_MAP["AEGLD-581e63"]],
            type: EPoolType.LendingPool,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgq7gj76m2c6yepujznzdy3tn9pdk2mlr2qrmcqp7l7sr",
            lpToken: TOKENS_MAP["ALP-6bb819"],
            tokens: [TOKENS_MAP["AUSD-47f281"], TOKENS_MAP["ALP-cc035f"]],
            type: EPoolType.MetaPool,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqa5q3qa3wgcmykemapza2ynah7mf55c04rmcqkevv5l",
            lpToken: TOKENS_MAP["ALP-193fb4"],
            tokens: [TOKENS_MAP["USDT-3e3720"], TOKENS_MAP["ASH-84eab0"]],
            type: EPoolType.PoolV2,
        },
    ],
    beta: [
        {
            address:
                "erd1qqqqqqqqqqqqqpgq3sfgh89vurcdet6lwl4cysqddeyk0rqh2gesqpkk4e",
            lpToken: TOKENS_MAP["ALP-9b7a73"],
            tokens: [
                TOKENS_MAP["USDC-8d4068"],
                TOKENS_MAP["USDT-188935"],
                TOKENS_MAP["BUSD-632f7d"],
            ],
            type: EPoolType.PlainPool,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgq65a4d6rv2czrk3uvfcxan7543geyvdp82ges44d43y",
            lpToken: TOKENS_MAP["ALP-6b7c94"],
            tokens: [TOKENS_MAP["BUSD-632f7d"], TOKENS_MAP["WEGLD-d7c6bb"]],
            type: EPoolType.PoolV2,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgq9flqlgtsek6k5ppcqh0hphzv9vv2dxn62geskve0ly",
            lpToken: TOKENS_MAP["ALP-0e6b1c"],
            tokens: [TOKENS_MAP["USDT-188935"], TOKENS_MAP["ASH-4ce444"]],
            type: EPoolType.PoolV2,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqtrla4ke85vs57e3jlua9dkm0ycgn6n2c2gesa02uuc",
            lpToken: TOKENS_MAP["ALP-3c3066"],
            tokens: [TOKENS_MAP["BUSD-632f7d"], TOKENS_MAP["UTK-a2a792"]],
            type: EPoolType.PoolV2,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqwqrrwk3npn4d26q5f0ltsang08q0fj8w2gesa4karx",
            lpToken: TOKENS_MAP["ALP-b9e453"],
            tokens: [TOKENS_MAP["USDT-188935"], TOKENS_MAP["HTM-fe1f69"]],
            type: EPoolType.PoolV2,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgq6t46575knqqfamnchlfgxvd56x2ymhvf2ges6xpr4s",
            lpToken: TOKENS_MAP["ALP-bf3d53"],
            tokens: [
                TOKENS_MAP["WEGLD-d7c6bb"],
                TOKENS_MAP["SEGLD-90b353"],
            ],
            type: EPoolType.LendingPool,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqn4uu4yauhv8pjjvhvgxmhyqk82ftzytq2gesrmrprk",
            lpToken: TOKENS_MAP["ALP-9836b4"],
            tokens: [
                TOKENS_MAP["WEGLD-d7c6bb"],
                TOKENS_MAP["HSEGLD-8f2360"],
            ],
            type: EPoolType.LendingPool,
        },
    ],
};

const mainnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqs8p2v9wr8j48vqrmudcj94wu47kqra3r4fvshfyd9c",
        lpToken: TOKENS_MAP["ALP-afc922"],
        tokens: [
            TOKENS_MAP["USDC-c76f1f"],
            TOKENS_MAP["USDT-f8c08c"],
            TOKENS_MAP["BUSD-40b57e"],
        ],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq5l05l0ts4lphdktx33apl0ss9rzf4r244fvsva6j53",
        lpToken: TOKENS_MAP["ALP-5f9191"],
        tokens: [TOKENS_MAP["BUSD-40b57e"], TOKENS_MAP["WEGLD-bd4d79"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqn7969pvzaatp8p9yu6u5h2ce2gyw0x9j4fvsplvthl",
        lpToken: TOKENS_MAP["ALP-2d0cf8"],
        tokens: [TOKENS_MAP["USDT-f8c08c"], TOKENS_MAP["ASH-a642d1"]],
        type: EPoolType.PoolV2,
    },
];

const pools =
    ENVIRONMENT.NETWORK == "devnet"
        ? [...devnet[ENVIRONMENT.ENV], ...MAIAR_POOLS]
        : [...mainnet];
export const POOLS_MAP_ADDRESS = Object.fromEntries(
    pools.map((p) => [p.address, p])
);
export const POOLS_MAP_LP = Object.fromEntries(
    pools.map((p) => [p.lpToken.identifier, p])
);
const getTokenFromPools = (...pools: IPool[]) => {
    const map = new Map<string, IESDTInfo>();
    let useWEGLD = false;
    pools.map((pool) => {
        pool.tokens.map((token) => {
            useWEGLD = useWEGLD || WRAPPED_EGLD.wegld === token.identifier;
            map.set(token.identifier, token);
        });
    });
    return [
        ...(useWEGLD ? [TOKENS_MAP["EGLD"]] : []),
        ...Array.from(map.values()),
    ];
};

export const IN_POOL_TOKENS = getTokenFromPools(...pools);
export const IN_POOL_TOKENS_MAP = Object.fromEntries(
    IN_POOL_TOKENS.map((t) => [t.identifier, t])
);
export default pools;
