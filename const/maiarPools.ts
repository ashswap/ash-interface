import IconAsh from "assets/images/ash-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IPool from "interface/pool";
export const MAIAR_POOLS: IPool[] = [
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
