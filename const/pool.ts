import IPool from "interface/pool";
import IconBTC from "assets/images/btc-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconWUSDC from "assets/images/wusdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import { ENVIRONMENT } from "./env";

const devnet: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqj368esm9hej8xyza60ndmxvj2p6xu44ermcqwjspx8",
        lpToken: {
            id: "LPT-a043fb",
            icon: "#fff",
            name: "LPT-a043fb",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-98bac5",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "USDT-c5ce87",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
                coingeckoId: "tether",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqpz908v8rx6fjemce6jj5ca6zlg2t72ftrmcqkafq5j",
        lpToken: {
            id: "LPT-f11891",
            icon: "#fff",
            name: "LPT-f11891",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-98bac5",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "WUSDC-0142ed",
                icon: IconWUSDC,
                name: "wUSDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqhs8td0ywl39d0vrhqhkn8asvshcq0xymrmcqlq8gxk",
        lpToken: {
            id: "LPT-5b1224",
            icon: "#fff",
            name: "LPT-5b1224",
            decimals: 18,
        },
        tokens: [
            {
                id: "BTC-2bcdc2",
                icon: IconBTC,
                name: "BTC",
                decimals: 6,
                coingeckoId: "bitcoin",
            },
            {
                id: "WBTC-8b760d",
                icon: IconWBTC,
                name: "wBTC",
                decimals: 6,
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
            icon: "#fff",
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
            icon: "#fff",
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
            icon: "#fff",
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

const pools = ENVIRONMENT.NETWORK == "devnet" ? devnet : testnet;

export default pools;
