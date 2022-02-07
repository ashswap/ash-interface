import IPool from "interface/pool";
import IconBTC from "assets/images/btc-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconWUSDC from "assets/images/wusdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";

const pools: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgq6hqnzcwapvdx2wj2e58gkv77xln8k84fj9tss3pv2v",
        lpToken: {
            id: "LPT-6c8a05",
            icon: "#fff",
            name: "LPT-6c8a05",
            decimals: 18
        },
        tokens: [
            {
                id: "USDC-8faa2a",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin"
            },
            {
                id: "USDT-c338e7",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
                coingeckoId: "tether"
            }
        ]
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqwul8rrezd3maq2ujv2wrlckxfpesa27fj9ts4jt8vg",
        lpToken: {
            id: "LPT-71249c",
            icon: "#fff",
            name: "LPT-71249c",
            decimals: 18
        },
        tokens: [
            {
                id: "USDC-8faa2a",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin"
            },
            {
                id: "WUSDC-e789ff",
                icon: IconWUSDC,
                name: "wUSDC",
                decimals: 6,
                coingeckoId: "usd-coin"
            }
        ]
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqn7tfkyfev4d49wlk9zy7ucfjcqwg9jc9j9tszc6vjr",
        lpToken: {
            id: "LPT-7aeb87",
            icon: "#fff",
            name: "LPT-7aeb87",
            decimals: 18
        },
        tokens: [
            {
                id: "BTC-2ffd41",
                icon: IconBTC,
                name: "BTC",
                decimals: 6,
                coingeckoId: "bitcoin"
            },
            {
                id: "WBTC-3a40c6",
                icon: IconWBTC,
                name: "wBTC",
                decimals: 6,
                coingeckoId: "wrapped-bitcoin"
            }
        ]
    }
];

export default pools;
