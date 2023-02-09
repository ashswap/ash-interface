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
                "erd1qqqqqqqqqqqqqpgqxhmvqrtnk928dsf33yqzgpcv9dvm05f9rmcqn5wgcj",
            lpToken: {
                identifier: "ALP-c0c25f",
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
                "erd1qqqqqqqqqqqqqpgqlz37jmhm43s4qw9q4x0syvs0j0ujun26rmcq249aqg",
            lpToken: {
                identifier: "ALP-836706",
                chainId: ChainId.Devnet,
                symbol: "LPT-wEGLD-aEGLD",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["WEGLD-578a26"], TOKENS_MAP["AEGLD-126d13"]],
            type: EPoolType.PlainPool,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgq4d8z6s7r47vwemry4pm4jrssetckkc8rrmcqxuqc4q",
            lpToken: {
                identifier: "ALP-1096a5",
                chainId: ChainId.Devnet,
                symbol: "LPT-wEGLD-aEGLD",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["WEGLD-578a26"], TOKENS_MAP["BUSD-b53884"]],
            type: EPoolType.PoolV2,
        },
    ],
    beta: [
        {
            address:
                "erd1qqqqqqqqqqqqqpgq80q950zr245yeslsdkawum9x9fva02mmrmcqlsdvfj",
            lpToken: {
                identifier: "ALP-5c3c3f",
                chainId: ChainId.Devnet,
                symbol: "ALP3USD",
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
        // {
        //     address:
        //         "erd1qqqqqqqqqqqqqpgq538lw0v2r50drzvuk6r679wh5nancavermcqg040vs",
        //     lpToken: {
        //         identifier: "ALP-fc47a2",
        //         chainId: ChainId.Devnet,
        //         symbol: "LPT-USDC-USDT",
        //         name: "Ashswap LP",
        //         decimals: 18,
        //     },
        //     tokens: [TOKENS_MAP["USDC-8d4068"], TOKENS_MAP["USDT-324eda"]],
        // },
        // {
        //     address:
        //         "erd1qqqqqqqqqqqqqpgqtxh9fk05q2jkeydlghqdyqv9wem56umhrmcq2vjwul",
        //     lpToken: {
        //         identifier: "LPT-2de32e",
        //         chainId: ChainId.Devnet,
        //         symbol: "LPT-3pool",
        //         name: "Ashswap LP",
        //         decimals: 18,
        //     },
        //     tokens: [TOKENS_MAP["USDC-6c5d88"], TOKENS_MAP["USDT-324eda"], TOKENS_MAP["WUSDC-232e24"]],
        // },
        // {
        //     address:
        //         "erd1qqqqqqqqqqqqqpgqrl56gfxdkr2e9xs2ee992jtswl38x372rmcqksswu9",
        //     lpToken: {
        //         identifier: "LPT-820467",
        //         chainId: ChainId.Devnet,
        //         symbol: "LPT-renBTC-wBTC",
        //         name: "Ashswap LP",
        //         decimals: 18,
        //     },
        //     tokens: [TOKENS_MAP["RENBTC-a74396"], TOKENS_MAP["WBTC-1297c1"]],
        // },
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
