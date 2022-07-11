import IPool from "interface/pool";
import { ENVIRONMENT } from "./env";
import { MAIAR_POOLS } from "./maiarPools";
import { TOKENS_MAP } from "./tokens";
import { CHAIN_ID } from "./dappConfig";
import { IToken } from "interface/token";

const devnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgq3xmeur9f8s4j6lj0yhv9e38ghllfp55hrmcqtnx6q3",
        lpToken: {
            id: "LPT-9467c3",
            chainId: CHAIN_ID.DEVNET,
            symbol: "LPT-USDC-USDT",
            name: "Ashswap LP",
            decimals: 18,
            icon: "",
        },
        tokens: [TOKENS_MAP["USDC-d5181d"], TOKENS_MAP["USDT-a55fa7"]],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqugd66zhe3k9e0nzwe9v2yegxsjvp6hy8rmcqss20g6",
        lpToken: {
            id: "LPT-d50bed",
            chainId: CHAIN_ID.DEVNET,
            symbol: "LPT-USDC-wUSDC",
            name: "Ashswap LP",
            decimals: 18,
            icon: "",
        },
        tokens: [TOKENS_MAP["USDC-d5181d"], TOKENS_MAP["WUSDC-3124eb"]],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqnm7kycd97aklkckpnx0c6vg9k3fv4jy5rmcq9g9xw6",
        lpToken: {
            id: "LPT-3b7ee0",
            chainId: CHAIN_ID.DEVNET,
            symbol: "LPT-renBTC-wBTC",
            name: "Ashswap LP",
            decimals: 18,
            icon: "",
        },
        tokens: [TOKENS_MAP["RENBTC-0b6973"], TOKENS_MAP["WBTC-9bdb9b"]],
    },
];

const testnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqup9ww85el3d609x96nuvev7axv3y7kcyj9ts6ny2us",
        lpToken: {
            id: "LPT-f0204d",
            chainId: CHAIN_ID.TESTNET,
            symbol: "LPT-USDC-USDT",
            name: "Ashswap LP",
            decimals: 18,
            icon: "",
        },
        tokens: [TOKENS_MAP["USDC-cbf0b9"], TOKENS_MAP["USDT-8d1668"]],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqsteq4s8cspwhy3tfd2kn6sed87ktql3xj9tspx4qgs",
        lpToken: {
            id: "LPT-75f818",
            chainId: CHAIN_ID.TESTNET,
            symbol: "LPT-USDC-wUSDC",
            name: "Ashswap LP",
            decimals: 18,
            icon: "",
        },
        tokens: [TOKENS_MAP["USDC-cbf0b9"], TOKENS_MAP["WUSDC-365a33"]],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqythjwuvwqw4qxl73fd8zzk2kh4wqfqgxj9tscants9",
        lpToken: {
            id: "LPT-2acb85",
            chainId: CHAIN_ID.TESTNET,
            symbol: "LPT-renBTC-wBTC",
            name: "Ashswap LP",
            decimals: 18,
            icon: "",
        },
        tokens: [TOKENS_MAP["RENBTC-36935a"], TOKENS_MAP["WBTC-ebec12"]],
    },
];

const pools = ENVIRONMENT.NETWORK == "devnet" ? [...devnet, ...MAIAR_POOLS] : [...testnet, ...MAIAR_POOLS];
export const POOLS_MAP_ADDRESS = Object.fromEntries(pools.map(p => [p.address, p]));
export const POOLS_MAP_LP = Object.fromEntries(pools.map(p => [p.lpToken.id, p]));
const getTokenFromPools = (...pools: IPool[]) => {
    const map = new Map<string, IToken>();
    pools.map((pool) => {
        pool.tokens.map((token) => {
            map.set(token.id, token);
        });
    });
    return Array.from(map.values());
};

export const IN_POOL_TOKENS = getTokenFromPools(...pools);
export const IN_POOL_TOKENS_MAP = Object.fromEntries(
    IN_POOL_TOKENS.map((t) => [t.id, t])
);
export default pools;
