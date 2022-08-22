import { ChainId, IESDTInfo } from "helper/token/token";
import IPool from "interface/pool";
import { ENVIRONMENT } from "./env";
import { MAIAR_POOLS } from "./maiarPools";
import { TOKENS_MAP } from "./tokens";

const devnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqest94j9tqlk2e0jjm93evdagye6eazfhrmcqp6j9mh",
        lpToken: {
            identifier: "LPT-02bf1a",
            chainId: ChainId.Devnet,
            symbol: "LPT-USDC-USDT",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [TOKENS_MAP["USDC-d5181d"], TOKENS_MAP["USDT-a55fa7"]],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq09nwtj56q8vwwuq47me5yxsqjfrn45k9rmcqwxrcnw",
        lpToken: {
            identifier: "LPT-fb4d45",
            chainId: ChainId.Devnet,
            symbol: "LPT-USDC-wUSDC",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [TOKENS_MAP["USDC-d5181d"], TOKENS_MAP["WUSDC-3124eb"]],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqxgwuy752gr6zth9d8d7jhdnfhkp7nr6grmcq9fd3gj",
        lpToken: {
            identifier: "LPT-fd847c",
            chainId: ChainId.Devnet,
            symbol: "LPT-renBTC-wBTC",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [TOKENS_MAP["RENBTC-0b6973"], TOKENS_MAP["WBTC-9bdb9b"]],
    },
];

const testnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqt2cjkzwe0898pqyl2gesul79gf0etyfgj9tsj9knsy",
        lpToken: {
            identifier: "LPT-3959c7",
            chainId: ChainId.Testnet,
            symbol: "LPT-USDC-USDT",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [TOKENS_MAP["USDC-cbf0b9"], TOKENS_MAP["USDT-8d1668"]],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqsp7xh4fydsw73dlza8edfrxslv7h2luyj9tszsjexv",
        lpToken: {
            identifier: "LPT-231a1f",
            chainId: ChainId.Testnet,
            symbol: "LPT-USDC-wUSDC",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [TOKENS_MAP["USDC-cbf0b9"], TOKENS_MAP["WUSDC-365a33"]],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqcyevummckw807vrsg89mrcn00ltr5xe7j9tsvaaswr",
        lpToken: {
            identifier: "LPT-a51712",
            chainId: ChainId.Testnet,
            symbol: "LPT-renBTC-wBTC",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [TOKENS_MAP["RENBTC-36935a"], TOKENS_MAP["WBTC-ebec12"]],
    },
];

const pools =
    ENVIRONMENT.NETWORK == "devnet" ? devnet : [...testnet, ...MAIAR_POOLS];
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
