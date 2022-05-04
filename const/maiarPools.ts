import IconAsh from "assets/images/ash-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IPool from "interface/pool";
export const MAIAR_POOLS: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgq3ygmhcsv3x945trks4mj5x6ap3rfsp3szh0qqq0q4q",
        lpToken: {
            id: "LPT-27a9ec",
            icon: "#fff",
            name: "LPT-27a9ec",
            decimals: 18,
        },
        tokens: [
            {
                id: "ASH-f7c9ea",
                icon: IconAsh,
                name: "ASH",
                decimals: 18,
            },
            {
                id: "USDT-b070dd",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
            },
        ],
        isMaiarPool: true,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq2l6flczxhql5dxh3jxtk5mut8nfv0kmyzh0qqk7an6",
        lpToken: {
            id: "LPT-93d436",
            icon: "#fff",
            name: "LPT-93d436",
            decimals: 18,
        },
        tokens: [
            {
                id: "WBTC-2d09a6",
                icon: IconWBTC,
                name: "wBTC",
                decimals: 8,
            },
            {
                id: "USDC-ae1f6d",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
            },
        ],
        isMaiarPool: true
    },
];
