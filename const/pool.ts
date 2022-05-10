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
            "erd1qqqqqqqqqqqqqpgqaphkarlvclh2c3v0hq2em73gcuxkh5yxj9ts6s5dt2",
        lpToken: {
            id: "LPT-89ce1b",
            icon: "",
            name: "LPT-89ce1b",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-780dd8",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "USDT-7d8186",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
                coingeckoId: "tether",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq4nkwakpzh60akfjld0990v93s803eam7j9ts76jvn0",
        lpToken: {
            id: "LPT-a56ef1",
            icon: "",
            name: "LPT-a56ef1",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-780dd8",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "WUSDC-553207",
                icon: IconWUSDC,
                name: "wUSDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqu8cqv3ajn52pnkfz3ftuk49r0y4kxcezj9tse6q77g",
        lpToken: {
            id: "LPT-907366",
            icon: "",
            name: "LPT-907366",
            decimals: 18,
        },
        tokens: [
            {
                id: "BTC-38b805",
                icon: IconBTC,
                name: "BTC",
                decimals: 6,
                coingeckoId: "bitcoin",
            },
            {
                id: "WBTC-aefe2f",
                icon: IconWBTC,
                name: "wBTC",
                decimals: 6,
                coingeckoId: "wrapped-bitcoin",
            },
        ],
    },
];

const pools = ENVIRONMENT.NETWORK == "devnet" ? [...devnet, ...MAIAR_POOLS] : testnet;

export default pools;
