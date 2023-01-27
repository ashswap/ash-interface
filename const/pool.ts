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
                "erd1qqqqqqqqqqqqqpgqcuyp4e20elkc2yjfskdqqe6d70zdqkhhrmcqrqx8dj",
            lpToken: {
                identifier: "ALP-07fca7",
                chainId: ChainId.Devnet,
                symbol: "ALP3USD",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-8d4068"], TOKENS_MAP["USDT-324eda"], TOKENS_MAP["BUSD-85dac0"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgq538lw0v2r50drzvuk6r679wh5nancavermcqg040vs",
            lpToken: {
                identifier: "ALP-fc47a2",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDC-USDT",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-8d4068"], TOKENS_MAP["USDT-324eda"]],
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqtxh9fk05q2jkeydlghqdyqv9wem56umhrmcq2vjwul",
            lpToken: {
                identifier: "LPT-2de32e",
                chainId: ChainId.Devnet,
                symbol: "LPT-3pool",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDC-6c5d88"], TOKENS_MAP["USDT-324eda"], TOKENS_MAP["WUSDC-232e24"]],
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
        tokens: [TOKENS_MAP["USDC-bb1e62"], TOKENS_MAP["USDT-821a84"], TOKENS_MAP["BUSD-7f6b0f"]],
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
        tokens: [TOKENS_MAP["USDC-c76f1f"], TOKENS_MAP["USDT-f8c08c"], TOKENS_MAP["BUSD-40b57e"]],
    },
];

const pools =
    ENVIRONMENT.NETWORK == "devnet" ? [...devnet[ENVIRONMENT.ENV], ...MAIAR_POOLS] : [...mainnet, ...MAIAR_POOLS];
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
