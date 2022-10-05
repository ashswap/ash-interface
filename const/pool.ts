import { ChainId, IESDTInfo } from "helper/token/token";
import IPool from "interface/pool";
import { ENVIRONMENT } from "./env";
import { MAIAR_POOLS } from "./maiarPools";
import { TOKENS_MAP } from "./tokens";

type PoolConfig = {
    beta: IPool[];
    alpha: IPool[];
};
const devnet: PoolConfig = {
    beta: [
        {
            address:
                "erd1qqqqqqqqqqqqqpgqazgqgzj4ze67c2vqydt0rxfmj6nsctmwrmcq4d5qwg",
            lpToken: {
                identifier: "LPT-02eb87",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDC-USDT",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-d5181d"], TOKENS_MAP["USDT-a55fa7"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgq8a9qdaayr4fq2uana9t5uwn4ym5d76grrmcq9amee4",
            lpToken: {
                identifier: "LPT-00e9fe",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDC-wUSDC",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-d5181d"], TOKENS_MAP["WUSDC-3124eb"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqremkn4680g9plp63lgmxj6z2v9tpj664rmcqf70k9q",
            lpToken: {
                identifier: "LPT-1b22d4",
                chainId: ChainId.Devnet,
                symbol: "LPT-renBTC-wBTC",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["RENBTC-0b6973"], TOKENS_MAP["WBTC-9bdb9b"]],
        },
    ],
    alpha: [
        {
            address:
                "erd1qqqqqqqqqqqqqpgq5wzf04ydtvdjg2cety9ve4jal4ja6jp6rmcq9tqf4h",
            lpToken: {
                identifier: "LPT-e94e61",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDC-USDT",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-d5181d"], TOKENS_MAP["USDT-a55fa7"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqvy4vkfxcd57fprs3jzal8ex0yuk6c2xsrmcqa9k9h7",
            lpToken: {
                identifier: "LPT-bd1ee9",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDC-wUSDC",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-d5181d"], TOKENS_MAP["WUSDC-3124eb"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgq66c48ferx7tm97wvx47hzgwx6wyg95xqrmcqkw983w",
            lpToken: {
                identifier: "LPT-66c89c",
                chainId: ChainId.Devnet,
                symbol: "LPT-renBTC-wBTC",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["RENBTC-0b6973"], TOKENS_MAP["WBTC-9bdb9b"]],
        },
    ],
};

const mainnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqxkhgsfrejldzmnnjglx0pc2y5ssr4k92j9ts9ryaqe",
        lpToken: {
            identifier: "LPT-9cf3ed",
            chainId: ChainId.Testnet,
            symbol: "LPT-USDC-USDT",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [TOKENS_MAP["USDC-cbf0b9"], TOKENS_MAP["USDT-8d1668"]],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqwfqh8gu8kgc0gp0gcye9jkqg278ly340j9tsr29hp4",
        lpToken: {
            identifier: "LPT-d1e2b6",
            chainId: ChainId.Testnet,
            symbol: "LPT-USDC-wUSDC",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [TOKENS_MAP["USDC-cbf0b9"], TOKENS_MAP["WUSDC-365a33"]],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqgk44n93n2pjsyynz0dzndr6yej7c7u5mj9ts3n4cfn",
        lpToken: {
            identifier: "LPT-643463",
            chainId: ChainId.Testnet,
            symbol: "LPT-renBTC-wBTC",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [TOKENS_MAP["RENBTC-36935a"], TOKENS_MAP["WBTC-ebec12"]],
    },
];

const pools =
    ENVIRONMENT.NETWORK == "devnet" ? [...devnet[ENVIRONMENT.ENV], ...MAIAR_POOLS] : mainnet;
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
