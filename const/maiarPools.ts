import IconAsh from "assets/images/ash-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import IconBTC from "assets/images/btc-icon.png";
import IPool from "interface/pool";
export const MAIAR_POOLS: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqp8mhm4dzt4vusdt2g36smup2f5vrtgrszh0qdpeqxx",
        lpToken: {
            id: "LPT-fd5668",
            icon: "#fff",
            name: "LPT-fd5668",
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
                id: "USDT-fedd98",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
            },
        ],
        isMaiarPool: true,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqe3wfkwqm49jmfeehc6apl59h6rv2h29lzh0qsg3ey5",
        lpToken: {
            id: "LPT-bfa0a3",
            icon: "#fff",
            name: "LPT-bfa0a3",
            decimals: 18,
        },
        tokens: [
            {
                id: "WBTC-027977",
                icon: IconBTC,
                name: "renBTC",
                decimals: 8,
            },
            {
                id: "USDC-fecc49",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
            },
        ],
        isMaiarPool: true
    },
];
