import IPool from "interface/pool";
import { CHAIN_ID } from "./dappConfig";
import { ENVIRONMENT } from "./env";
import { TOKENS_MAP } from "./tokens";

export const devnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgq9efzwnujjm6f75pccujr2jp4j5csym0vrmcqg9r3ff",
        lpToken: {
            id: "LPT-8d3117",
            chainId: CHAIN_ID.DEVNET,
            symbol: "LPT-ASH-USDT",
            name: "Maiar LP",
            decimals: 18,
            icon: "#fff",
        },
        tokens: [TOKENS_MAP["ASH-4ce444"], TOKENS_MAP["USDT-a55fa7"]],
        isMaiarPool: true,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqkec4u8tkq4tztu30vvk889dnnddex5k8rmcqqnw6a4",
        lpToken: {
            id: "LPT-a31851",
            chainId: CHAIN_ID.DEVNET,
            symbol: "LPT-wBTC-USDC",
            name: "Maiar LP",
            decimals: 18,
            icon: "#fff",
        },
        tokens: [TOKENS_MAP["WBTC-9bdb9b"], TOKENS_MAP["USDC-d5181d"]],
        isMaiarPool: true,
    },
];

export const testnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqwsmx0d2x20v855ljrh55swg9q4tr06y5j9ts38pupx",
        lpToken: {
            id: "LPT-d8005f",
            chainId: CHAIN_ID.TESTNET,
            symbol: "LPT-ASH-USDT",
            name: "Maiar LP",
            decimals: 18,
            icon: "#fff",
        },
        tokens: [TOKENS_MAP["ASH-f01858"], TOKENS_MAP["USDT-8d1668"]],
        isMaiarPool: true,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqvv2p4u35v5yayn0s6ksf8ug97uf64dduj9tskx0eve",
        lpToken: {
            id: "LPT-8b0f7b",
            chainId: CHAIN_ID.TESTNET,
            symbol: "LPT-wBTC-USDC",
            name: "Maiar LP",
            decimals: 18,
            icon: "#fff",
        },
        tokens: [TOKENS_MAP["WBTC-ebec12"], TOKENS_MAP["USDC-cbf0b9"]],
        isMaiarPool: true,
    },
];

export const MAIAR_POOLS = ENVIRONMENT.NETWORK == "devnet" ? devnet : testnet;
