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
                "erd1qqqqqqqqqqqqqpgqqfgw74wwh7lwdenmlkfkkd626nffju9armcql6amqa",
            lpToken: {
                identifier: "ALP-a3ac6b",
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
                "erd1qqqqqqqqqqqqqpgqtyh5plp25n3kfx353pyjda53hqvc035yrmcqxs5sdc",
            lpToken: {
                identifier: "ALP-d531b5",
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
                "erd1qqqqqqqqqqqqqpgqd7heha9n8ds2j6zl46s05hnue352fd9wrmcqrv937t",
            lpToken: {
                identifier: "ALP-30ef76",
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
                identifier: "ALP-48f785",
                chainId: ChainId.Devnet,
                symbol: "LPT-ASH-USDT",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDT-188935"], TOKENS_MAP["ASH-4ce444"]],
            type: EPoolType.PoolV2,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqga369hdj5ajac3ud2tvycxcsf2g65k852gesqaq96s",
            lpToken: {
                identifier: "ALP-44bcf0",
                chainId: ChainId.Devnet,
                symbol: "LPT-BUSD-UTK",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["BUSD-632f7d"], TOKENS_MAP["UTK-a2a792"]],
            type: EPoolType.PoolV2,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqu4hvktdlhkz2trs05mhrp672pjmy98yn2gesjkmjna",
            lpToken: {
                identifier: "ALP-a3a2f6",
                chainId: ChainId.Devnet,
                symbol: "LPT-USDT-HTM",
                name: "Ashswap LP",
                decimals: 18,
            },
            tokens: [TOKENS_MAP["USDT-188935"], TOKENS_MAP["HTM-fe1f69"]],
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
            "erd1qqqqqqqqqqqqqpgqdngq580ceg8fsrmk5fad8cckzr2m6d2t2ges46gedp",
        lpToken: {
            identifier: "ALP-c12752",
            chainId: ChainId.Mainnet,
            symbol: "ALP-3pool",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [
            TOKENS_MAP["USDC-bb1e62"],
            TOKENS_MAP["USDT-821a84"],
            TOKENS_MAP["BUSD-2cbb2d"],
        ],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq5tyhky2cgatakmjwpdpx5p5zh9keqqm32gesnukatu",
        lpToken: {
            identifier: "ALP-d935a5",
            chainId: ChainId.Mainnet,
            symbol: "ALP-BUSD-WEGLD",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [
            TOKENS_MAP["BUSD-2cbb2d"],
            TOKENS_MAP["WEGLD-795247"],
        ],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqn5at779he2gp3tuj4vsmlq7wntdqjq6d2gesftjyd0",
        lpToken: {
            identifier: "ALP-c0b453",
            chainId: ChainId.Mainnet,
            symbol: "ALP-USDT-ASH",
            name: "Ashswap LP",
            decimals: 18,
        },
        tokens: [
            TOKENS_MAP["USDT-821a84"],
            TOKENS_MAP["ASH-a85626"],
        ],
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
    return [...(useWEGLD ? [TOKENS_MAP["EGLD"]] : []), ...Array.from(map.values())];
};

export const IN_POOL_TOKENS = getTokenFromPools(...pools);
export const IN_POOL_TOKENS_MAP = Object.fromEntries(
    IN_POOL_TOKENS.map((t) => [t.identifier, t])
);
export default pools;
