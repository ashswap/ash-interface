import IPool from "interface/pool";
import IconBTC from "assets/images/btc-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconWUSDC from "assets/images/wusdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import { ENVIRONMENT } from "./env";
import { MAIAR_POOLS } from "./maiarPools";

const devnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqzxcjxnxsw99lzdjqtcak5x8x39pkxkz0rmcqyl76wx",
        lpToken: {
            id: "LPT-999601",
            icon: "",
            name: "LPT-999601",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-d5181d",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "USDT-a55fa7",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
                coingeckoId: "tether",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq9wj92y9sfw0dua57664hdc5gd656h95yrmcqtnqv5l",
        lpToken: {
            id: "LPT-ea941a",
            icon: "",
            name: "LPT-ea941a",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-d5181d",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "WUSDC-3124eb",
                icon: IconWUSDC,
                name: "wUSDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqla72lhk8szfdh2l2nt9vflt803uz3prsrmcq2w885d",
        lpToken: {
            id: "LPT-8860c3",
            icon: "",
            name: "LPT-8860c3",
            decimals: 18,
        },
        tokens: [
            {
                id: "RENBTC-0b6973",
                icon: IconBTC,
                name: "renBTC",
                decimals: 8,
                coingeckoId: "bitcoin",
            },
            {
                id: "WBTC-9bdb9b",
                icon: IconWBTC,
                name: "wBTC",
                decimals: 8,
                coingeckoId: "wrapped-bitcoin",
            },
        ],
    },
];

const testnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqup9ww85el3d609x96nuvev7axv3y7kcyj9ts6ny2us",
        lpToken: {
            id: "LPT-f0204d",
            icon: "",
            name: "LPT-f0204d",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-cbf0b9",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "USDT-8d1668",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
                coingeckoId: "tether",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqsteq4s8cspwhy3tfd2kn6sed87ktql3xj9tspx4qgs",
        lpToken: {
            id: "LPT-75f818",
            icon: "",
            name: "LPT-75f818",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-cbf0b9",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "WUSDC-365a33",
                icon: IconWUSDC,
                name: "wUSDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqythjwuvwqw4qxl73fd8zzk2kh4wqfqgxj9tscants9",
        lpToken: {
            id: "LPT-2acb85",
            icon: "",
            name: "LPT-2acb85",
            decimals: 18,
        },
        tokens: [
            {
                id: "RENBTC-36935a",
                icon: IconBTC,
                name: "BTC",
                decimals: 8,
                coingeckoId: "bitcoin",
            },
            {
                id: "WBTC-ebec12",
                icon: IconWBTC,
                name: "wBTC",
                decimals: 8,
                coingeckoId: "wrapped-bitcoin",
            },
        ],
    },
];

const pools = ENVIRONMENT.NETWORK == "devnet" ? [...devnet, ...MAIAR_POOLS] : [...testnet, ...MAIAR_POOLS];

export default pools;
