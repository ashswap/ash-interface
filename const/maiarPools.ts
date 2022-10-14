import IPool from "interface/pool";
import { CHAIN_ID } from "./dappConfig";
import { ENVIRONMENT } from "./env";
import { TOKENS_MAP } from "./tokens";
type MaiarPoolConfig = {
    alpha: IPool[];
    beta: IPool[];
};
const devnet: MaiarPoolConfig = {
    alpha: [
        {
            address:
                "erd1qqqqqqqqqqqqqpgq9efzwnujjm6f75pccujr2jp4j5csym0vrmcqg9r3ff",
            lpToken: {
                identifier: "LPT-8d3117",
                symbol: "LPT-8d3117",
                decimals: 18,
                chainId: CHAIN_ID.DEVNET,
                name: "Maiar LP",
            },
            tokens: [TOKENS_MAP["ASH-4ce444"], TOKENS_MAP["USDT-a55fa7"]],
            isMaiarPool: true,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqkec4u8tkq4tztu30vvk889dnnddex5k8rmcqqnw6a4",
            lpToken: {
                identifier: "LPT-a31851",
                symbol: "LPT-a31851",
                decimals: 18,
                chainId: CHAIN_ID.DEVNET,
                name: "Maiar LP",
            },
            tokens: [TOKENS_MAP["WBTC-9bdb9b"], TOKENS_MAP["USDC-d5181d"]],
            isMaiarPool: true,
        },
    ],
    beta: [
        {
            address:
                "erd1qqqqqqqqqqqqqpgqhkh5meslneg4a5jxelc3uxzyx2h8dhgzrmcqglju3p",
            lpToken: {
                identifier: "LPT-bb63c8",
                symbol: "LPT-bb63c8",
                decimals: 18,
                chainId: CHAIN_ID.DEVNET,
                name: "Maiar LP",
            },
            tokens: [TOKENS_MAP["BUSD-46fbb9"], TOKENS_MAP["RENBTC-fb2e83"]],
            isMaiarPool: true,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgqyp36j7apxajzclu72d7d4h5ghhth2a9rrmcqgcfrgs",
            lpToken: {
                identifier: "LPT-8c4633",
                symbol: "LPT-8c4633",
                decimals: 18,
                chainId: CHAIN_ID.DEVNET,
                name: "Maiar LP",
            },
            tokens: [TOKENS_MAP["USDC-3ae937"], TOKENS_MAP["AEGLD-f09e97"]],
            isMaiarPool: true,
        },
        {
            address:
                "erd1qqqqqqqqqqqqqpgq2wupw4rr4lknm6rl75vcjzdxg48c5gvdrmcqgetg9e",
            lpToken: {
                identifier: "LPT-96c663",
                symbol: "LPT-96c663",
                decimals: 18,
                chainId: CHAIN_ID.DEVNET,
                name: "Maiar LP",
            },
            tokens: [TOKENS_MAP["USDT-186541"], TOKENS_MAP["ASH-6969f1"]],
            isMaiarPool: true,
        },
    ],
};

export const MAIAR_POOLS =
    ENVIRONMENT.NETWORK === "devnet" ? devnet[ENVIRONMENT.ENV] : [];
