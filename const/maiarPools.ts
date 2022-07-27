import IPool from "interface/pool";
import { CHAIN_ID } from "./dappConfig";
import { ENVIRONMENT } from "./env";
import { TOKENS_MAP } from "./tokens";

export const devnet: IPool[] = [];

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
