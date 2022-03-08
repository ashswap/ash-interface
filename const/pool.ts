import IPool from "interface/pool";
import IconBTC from "assets/images/btc-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconWUSDC from "assets/images/wusdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";

const pools: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgq6qfu8y5rkkauwzfute833qfa35w8cv0kj9tskdhkwd",
        lpToken: {
            id: "LPT-d53191",
            icon: "#fff",
            name: "LPT-d53191",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-27fb7c",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "USDT-255a9e",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
                coingeckoId: "tether",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqd0r7ucq3wzc0vp74qw6ama6k5hhpzvs6j9ts2v3w50",
        lpToken: {
            id: "LPT-9e5f31",
            icon: "#fff",
            name: "LPT-9e5f31",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-27fb7c",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "WUSDC-0e9bb4",
                icon: IconWUSDC,
                name: "wUSDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq8lxhl5xjf8klm9ksmfxxwr486xcqac75j9tscr8vcj",
        lpToken: {
            id: "LPT-6ab8f7",
            icon: "#fff",
            name: "LPT-6ab8f7",
            decimals: 18,
        },
        tokens: [
            {
                id: "BTC-180242",
                icon: IconBTC,
                name: "BTC",
                decimals: 6,
                coingeckoId: "bitcoin",
            },
            {
                id: "WBTC-bd639d",
                icon: IconWBTC,
                name: "wBTC",
                decimals: 6,
                coingeckoId: "wrapped-bitcoin",
            },
        ],
    },
];

export default pools;
