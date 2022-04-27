import IconAsh from "assets/images/ash-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconBTC from "assets/images/btc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import IPool from "interface/pool";
export const MAIAR_POOLS: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgq5jctt8y23k8qznwmgxfjf6vj8dncvdfzzh0q225ddy",
        lpToken: {
            id: "LPT-cdd8b0",
            icon: "#fff",
            name: "LPT-cdd8b0",
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
                id: "USDC-d6c57a",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
            },
        ],
        isMaiarPool: true,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgquz3kkwg6mnhsk6pvj99zttgyr4nakvrqzh0q5lv048",
        lpToken: {
            id: "LPT-0707f5",
            icon: "#fff",
            name: "LPT-0707f5",
            decimals: 18,
        },
        tokens: [
            {
                id: "BTC-573344",
                icon: IconBTC,
                name: "BTC",
                decimals: 6,
            },
            {
                id: "USDT-2f78fb",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
            },
        ],
        isMaiarPool: true
    },
];
