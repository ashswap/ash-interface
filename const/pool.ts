import IPool from "interface/pool";
import IconBTC from "assets/images/btc-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconWUSDC from "assets/images/wusdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";

const pools: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgq8duuqkxu5zmd6n8qrnmsqv3sayt7dc3nj9ts97ddum",
        lpToken: {
            id: "LPT-e26625",
            icon: "#fff",
            name: "LPT-e26625",
            decimals: 18
        },
        tokens: [
            {
                id: "USDC-cefb49",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin"
            },
            {
                id: "USDT-194acc",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
                coingeckoId: "tether"
            }
        ]
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqx4r0q39p7wky6a5pe5q90p7v307xyzr7j9tsrhtlv7",
        lpToken: {
            id: "LPT-8842c9",
            icon: "#fff",
            name: "LPT-8842c9",
            decimals: 18
        },
        tokens: [
            {
                id: "USDC-cefb49",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin"
            },
            {
                id: "WUSDC-b3b87f",
                icon: IconWUSDC,
                name: "wUSDC",
                decimals: 6,
                coingeckoId: "usd-coin"
            }
        ]
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqp6f23d64tefj95uwhey0wt3r2dwuzd5yj9tsjc4yqg",
        lpToken: {
            id: "LPT-8e880e",
            icon: "#fff",
            name: "LPT-8e880e",
            decimals: 18
        },
        tokens: [
            {
                id: "BTC-a34f8c",
                icon: IconBTC,
                name: "BTC",
                decimals: 6,
                coingeckoId: "bitcoin"
            },
            {
                id: "WBTC-472f92",
                icon: IconWBTC,
                name: "wBTC",
                decimals: 6,
                coingeckoId: "wrapped-bitcoin",
            }
        ]
    }
];

export default pools;
