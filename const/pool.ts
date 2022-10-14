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
    alpha: [
        {
            address:
                "erd1qqqqqqqqqqqqqpgq6vtnjc2w293578r6j63gfw2v79zpscz5rmcqew6yte",
            lpToken: {
                identifier: "LPT-a4b2f8",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDT-USDC",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDT-2c4852"], TOKENS_MAP["USDC-89351f"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqatr2pa4wz0df85saqmf2nnx9dh94re8srmcqdd5xwm",
            lpToken: {
                identifier: "LPT-e52d68",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDC-BUSD",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-89351f"], TOKENS_MAP["BUSD-104d95"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqahzscx5dd6frmgy754ykd662tghy9jn8rmcqt36cuv",
            lpToken: {
                identifier: "LPT-d1b971",
                chainId: ChainId.Devnet,
                symbol: "LPT-wEGLD-aEGLD",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["WEGLD-d6dee7"], TOKENS_MAP["AEGLD-3e2d88"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgq0s0kxtx5jdvgtqkdklv2avqxqmcz0y89rmcqcgwwyh",
            lpToken: {
                identifier: "LPT-9ef2ff",
                chainId: ChainId.Devnet,
                symbol: "LPT-wBTC-renBTC",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["WBTC-3965ad"], TOKENS_MAP["RENBTC-61ff58"]],
        },
    ],
    beta: [
        {
            address:
                "erd1qqqqqqqqqqqqqpgqd7yxyjpyj5px59sn48kf5sk6ppvzcxnlrmcq5gxdhw",
            lpToken: {
                identifier: "LPT-1cb0dd",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDT-USDC",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDT-186541"], TOKENS_MAP["USDC-3ae937"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqr279layxqhkzpamlkg72wt2kckfq586lrmcq52vlap",
            lpToken: {
                identifier: "LPT-554644",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDC-BUSD",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-3ae937"], TOKENS_MAP["BUSD-46fbb9"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgq3qh3s7ns3t02xhg0hu46d646vtnz9ypcrmcqfd2nfd",
            lpToken: {
                identifier: "LPT-840b08",
                chainId: ChainId.Devnet,
                symbol: "LPT-wEGLD-aEGLD",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["WEGLD-030586"], TOKENS_MAP["AEGLD-f09e97"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqu887uzj2k3e4006h3lnp9k7gdnkg84djrmcqd5rqwv",
            lpToken: {
                identifier: "LPT-340989",
                chainId: ChainId.Devnet,
                symbol: "LPT-wBTC-renBTC",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["WBTC-678a4f"], TOKENS_MAP["RENBTC-fb2e83"]],
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
    ENVIRONMENT.NETWORK == "devnet"
        ? [...devnet[ENVIRONMENT.ENV], ...MAIAR_POOLS]
        : mainnet;
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
