import IconAsh from "assets/images/ash-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IPool from "interface/pool";
import { ENVIRONMENT } from "./env";

export const devnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgq9efzwnujjm6f75pccujr2jp4j5csym0vrmcqg9r3ff",
        lpToken: {
            id: "LPT-8d3117",
            icon: "#fff",
            name: "LPT-8d3117",
            decimals: 18,
        },
        tokens: [
            {
                id: "ASH-4ce444",
                icon: IconAsh,
                name: "ASH",
                decimals: 18,
            },
            {
                id: "USDT-a55fa7",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
            },
        ],
        isMaiarPool: true,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqkec4u8tkq4tztu30vvk889dnnddex5k8rmcqqnw6a4",
        lpToken: {
            id: "LPT-a31851",
            icon: "#fff",
            name: "LPT-a31851",
            decimals: 18,
        },
        tokens: [
            {
                id: "WBTC-9bdb9b",
                icon: IconWBTC,
                name: "wBTC",
                decimals: 8,
            },
            {
                id: "USDC-d5181d",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
            },
        ],
        isMaiarPool: true
    },
];

export const testnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqwsmx0d2x20v855ljrh55swg9q4tr06y5j9ts38pupx",
        lpToken: {
            id: "LPT-d8005f",
            icon: "#fff",
            name: "LPT-d8005f",
            decimals: 18,
        },
        tokens: [
            {
                id: "ASH-f01858",
                icon: IconAsh,
                name: "ASH",
                decimals: 18,
            },
            {
                id: "USDT-8d1668",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
            },
        ],
        isMaiarPool: true,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqvv2p4u35v5yayn0s6ksf8ug97uf64dduj9tskx0eve",
        lpToken: {
            id: "LPT-8b0f7b",
            icon: "#fff",
            name: "LPT-8b0f7b",
            decimals: 18,
        },
        tokens: [
            {
                id: "WBTC-ebec12",
                icon: IconWBTC,
                name: "wBTC",
                decimals: 8,
            },
            {
                id: "USDC-cbf0b9",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
            },
        ],
        isMaiarPool: true
    },
];

export const MAIAR_POOLS = ENVIRONMENT.NETWORK == "devnet" ? devnet : testnet;