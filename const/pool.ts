import { ChainId, IESDTInfo } from "helper/token/token";
import IPool, { EPoolType } from "interface/pool";
import { ENVIRONMENT } from "./env";
import { MAIAR_POOLS } from "./maiarPools";
import { TOKENS_MAP } from "./tokens";

type PoolConfig = {
    beta: IPool[];
    alpha: IPool[];
};
const devnet: PoolConfig = {
    alpha: [
        {
            address:
                "erd1qqqqqqqqqqqqqpgq7dta07aq465zefmry2lzhrehjfptkna9rmcqn0nnxr",
            lpToken: {
                identifier: "ALP-466f16",
                chainId: ChainId.Devnet,
                symbol: "LPT-3pool",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-fd47e9"], TOKENS_MAP["USDT-3e3720"], TOKENS_MAP["BUSD-b53884"]],
            type: EPoolType.PlainPool,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqtuvclkmmg4glnsdmt2arwkq4g7whpwsmrmcq8rmk4c",
            lpToken: {
                identifier: "ALP-f4f347",
                chainId: ChainId.Devnet,
                symbol: "LPT-BUSD-wEGLD",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["BUSD-b53884"], TOKENS_MAP["WEGLD-578a26"]],
            type: EPoolType.PoolV2,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqx375qcncmwmx58uqdc58shkfvwhmgrg9rmcq0dmf86",
            lpToken: {
                identifier: "ALP-d01cf8",
                chainId: ChainId.Devnet,
                symbol: "LPT-ASH-USDT",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDT-3e3720"], TOKENS_MAP["ASH-84eab0"]],
            type: EPoolType.PoolV2,
        },
    ],
    beta: [
        {
            address:
                "erd1qqqqqqqqqqqqqpgqe5wx34pzxn33vmqa3cmfkwspp5rxe2q52geskyn8gz",
            lpToken: {
                identifier: "ALP-c874cd",
                chainId: ChainId.Devnet,
                symbol: "LPT-3pool",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [
                TOKENS_MAP["USDC-8d4068"],
                TOKENS_MAP["USDT-188935"],
                TOKENS_MAP["BUSD-632f7d"],
            ],
            type: EPoolType.PlainPool,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqvpvsw60awv39kq8kcqug4t8aqhqr4y2p2gesjqnwt4",
            lpToken: {
                identifier: "ALP-36485d",
                chainId: ChainId.Devnet,
                symbol: "LPT-BUSD-wEGLD",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["BUSD-632f7d"], TOKENS_MAP["WEGLD-d7c6bb"]],
            type: EPoolType.PoolV2,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqy7tg9y8c4p5kaf205f87m0zhleexjnzp2gesrdg5yr",
            lpToken: {
                identifier: "ALP-d01cf8",
                chainId: ChainId.Devnet,
                symbol: "LPT-ASH-USDT",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDT-188935"], TOKENS_MAP["ASH-4ce444"]],
            type: EPoolType.PoolV2,
        },
    ],
};

const mainnet: IPool[] = [
    // {
    //     address:
    //         "erd1qqqqqqqqqqqqqpgq23rr93etp8l3ejkn99wx0uacmmyylte7tk2qsgndsh",
    //     lpToken: {
    //         identifier: "ALP-4df369",
    //         chainId: ChainId.Mainnet,
    //         symbol: "LPT-USDC-USDT",
    //         name: "Ashswap LP",
    //         decimals: 18,
    //     },
    //     tokens: [TOKENS_MAP["USDC-bb1e62"], TOKENS_MAP["USDT-821a84"]],
    // },
    // {
    //     address:
    //         "erd1qqqqqqqqqqqqqpgqhjnxk0y3lnaplx77fahf6l39t7zkke74tk2qk3awv2",
    //     lpToken: {
    //         identifier: "ALP-35a95f",
    //         chainId: ChainId.Mainnet,
    //         symbol: "LPT-USDC-BUSD",
    //         name: "Ashswap LP",
    //         decimals: 18,
    //     },
    //     tokens: [TOKENS_MAP["USDC-bb1e62"], TOKENS_MAP["BUSD-7f6b0f"]],
    // },
    // {
    //     address:
    //         "erd1qqqqqqqqqqqqqpgqpggw86hkkv3yyrc5fzvg0xe68esq4rfjtk2qtpgcsm",
    //     lpToken: {
    //         identifier: "ALP-d6fa8e",
    //         chainId: ChainId.Mainnet,
    //         symbol: "LPT-wEGLD-aEGLD",
    //         name: "Ashswap LP",
    //         decimals: 18,
    //     },
    //     tokens: [TOKENS_MAP["WEGLD-795247"], TOKENS_MAP["AEGLD-a1f5d4"]],
    // },
    // {
    //     address:
    //         "erd1qqqqqqqqqqqqqpgqj6ntxz9zqvcvdumec6dua2xl4kyykmantk2qgq0yu8",
    //     lpToken: {
    //         identifier: "ALP-3e1426",
    //         chainId: ChainId.Mainnet,
    //         symbol: "LPT-renBTC-wBTC",
    //         name: "Ashswap LP",
    //         decimals: 18,
    //     },
    //     tokens: [TOKENS_MAP["RENBTC-9179c8"], TOKENS_MAP["WBTC-2d9033"]],
    // },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqjnl9caf076m864tg6rc05e6alxd2fpm2tk2qgx729y",
        lpToken: {
            identifier: "ALP-8efbbe",
            chainId: ChainId.Mainnet,
            symbol: "LPT-3pool",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [
            TOKENS_MAP["USDC-bb1e62"],
            TOKENS_MAP["USDT-821a84"],
            TOKENS_MAP["BUSD-7f6b0f"],
        ],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqu4qzl6qdm4467dqpavce39y3usrwjwagtk2qvjcy7g",
        lpToken: {
            identifier: "ALP-c011fd",
            chainId: ChainId.Mainnet,
            symbol: "LPT-3pool",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [
            TOKENS_MAP["USDC-c76f1f"],
            TOKENS_MAP["USDT-f8c08c"],
            TOKENS_MAP["BUSD-40b57e"],
        ],
        type: EPoolType.PlainPool,
    },
];

const pools =
    ENVIRONMENT.NETWORK == "devnet"
        ? [...devnet[ENVIRONMENT.ENV], ...MAIAR_POOLS]
        : [...mainnet, ...MAIAR_POOLS];
export const POOLS_MAP_ADDRESS = Object.fromEntries(
    pools.map((p) => [p.address, p])
);
export const POOLS_MAP_LP = Object.fromEntries(
    pools.map((p) => [p.lpToken.identifier, p])
);
const getTokenFromPools = (...pools: IPool[]) => {
    const map = new Map<string, IESDTInfo>();
    pools.map((pool) => {
        pool.tokens.map((token) => {
            map.set(token.identifier, token);
        });
    });
    return Array.from(map.values());
};

export const IN_POOL_TOKENS = getTokenFromPools(...pools);
export const IN_POOL_TOKENS_MAP = Object.fromEntries(
    IN_POOL_TOKENS.map((t) => [t.identifier, t])
);
export default pools;
