import { ChainId, IESDTInfo } from "helper/token/token";
import IPool from "interface/pool";
import { ENVIRONMENT } from "./env";
import { TOKENS_MAP } from "./tokens";

type PoolConfig = {
    beta: IPool[];
    alpha: IPool[];
};
const devnet: PoolConfig = {
    alpha: [
        {
            address:
                "erd1qqqqqqqqqqqqqpgqkt89kvvw789jlnsu4lm0xqf2hfr04p5grmcqprt73q",
            lpToken: {
                identifier: "LPT-227ae7",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDT-USDC",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-6c5d88"], TOKENS_MAP["USDT-324eda"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgq42v8shjhy67c2alkn606n36wlylewpg4rmcqymj695",
            lpToken: {
                identifier: "LPT-179382",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDC-BUSD",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-6c5d88"], TOKENS_MAP["WUSDC-232e24"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqcqd7kctyfyjfaxqzwyx0wshr22spnfqermcq8wxgdv",
            lpToken: {
                identifier: "LPT-b07ddc",
                chainId: ChainId.Devnet,
                symbol: "LPT-wEGLD-aEGLD",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["RENBTC-a74396"], TOKENS_MAP["WBTC-1297c1"]],
        },
    ],
    beta: [
        {
            address:
                "erd1qqqqqqqqqqqqqpgqa9lmuq52nv9n735q9gpm4v5847xqwhl2rmcq263q8v",
            lpToken: {
                identifier: "LPT-93bf25",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDC-USDT",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-6c5d88"], TOKENS_MAP["USDT-324eda"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqfa7c92aezxmry0va47l27mvydhh2rl08rmcqr32cjg",
            lpToken: {
                identifier: "LPT-d6b19f",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDC-WUSDC",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-6c5d88"], TOKENS_MAP["WUSDC-232e24"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqrl56gfxdkr2e9xs2ee992jtswl38x372rmcqksswu9",
            lpToken: {
                identifier: "LPT-820467",
                chainId: ChainId.Devnet,
                symbol: "LPT-renBTC-wBTC",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["RENBTC-a74396"], TOKENS_MAP["WBTC-1297c1"]],
        },
    ],
};

const mainnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgq23rr93etp8l3ejkn99wx0uacmmyylte7tk2qsgndsh",
        lpToken: {
            identifier: "ALP-4df369",
            chainId: ChainId.Testnet,
            symbol: "LPT-USDC-USDT",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [TOKENS_MAP["USDC-bb1e62"], TOKENS_MAP["USDT-821a84"]],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqhjnxk0y3lnaplx77fahf6l39t7zkke74tk2qk3awv2",
        lpToken: {
            identifier: "ALP-35a95f",
            chainId: ChainId.Testnet,
            symbol: "LPT-USDC-BUSD",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [TOKENS_MAP["USDC-bb1e62"], TOKENS_MAP["BUSD-7f6b0f"]],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqpggw86hkkv3yyrc5fzvg0xe68esq4rfjtk2qtpgcsm",
        lpToken: {
            identifier: "ALP-d6fa8e",
            chainId: ChainId.Devnet,
            symbol: "LPT-wEGLD-aEGLD",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [TOKENS_MAP["WEGLD-795247"], TOKENS_MAP["AEGLD-a1f5d4"]],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqj6ntxz9zqvcvdumec6dua2xl4kyykmantk2qgq0yu8",
        lpToken: {
            identifier: "ALP-3e1426",
            chainId: ChainId.Testnet,
            symbol: "LPT-renBTC-wBTC",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [TOKENS_MAP["RENBTC-9179c8"], TOKENS_MAP["WBTC-2d9033"]],
    },
];

const pools =
    ENVIRONMENT.NETWORK == "devnet" ? [...devnet[ENVIRONMENT.ENV]] : mainnet;
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
