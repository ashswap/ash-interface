import IPool from "interface/pool";
import IconBTC from "assets/images/btc-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconWUSDC from "assets/images/wusdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";

const pools: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqqgfdej6zyct50z0lljmt9k2l02w9jvxnj9ts3xn5vz",
        lpToken: {
            id: "LPT-8b37e8",
            icon: "#fff",
            name: "LPT-8b37e8",
            decimals: 18
        },
        tokens: [
            {
                id: "USDC-9b5c1e",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin"
            },
            {
                id: "USDT-991037",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
                coingeckoId: "tether"
            }
        ]
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqa750qr0qw5jl7jd0dflxyaajnu5uhretj9ts9g5y3s",
        lpToken: {
            id: "LPT-7ee4a6",
            icon: "#fff",
            name: "LPT-7ee4a6",
            decimals: 18
        },
        tokens: [
            {
                id: "USDC-9b5c1e",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin"
            },
            {
                id: "WUSDC-7dc0a2",
                icon: IconWUSDC,
                name: "wUSDC",
                decimals: 6,
                coingeckoId: "usd-coin"
            }
        ]
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqe2sgfvhju2zn03ts3s5v2hs0lp249cl7j9tsxxzhf8",
        lpToken: {
            id: "LPT-977258",
            icon: "#fff",
            name: "LPT-977258",
            decimals: 18
        },
        tokens: [
            {
                id: "BTC-599587",
                icon: IconBTC,
                name: "BTC",
                decimals: 6,
                coingeckoId: "bitcoin"
            },
            {
                id: "WBTC-901728",
                icon: IconWBTC,
                name: "wBTC",
                decimals: 6,
                coingeckoId: "wrapped-bitcoin",
            }
        ]
    }
];

export default pools;
