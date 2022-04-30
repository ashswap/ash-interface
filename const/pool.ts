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
            "erd1qqqqqqqqqqqqqpgq392nv8mkrhwvkaff2qlqcd5yj8jeexpmzh0q4us968",
        lpToken: {
            id: "LPT-44f690",
            icon: "#fff",
            name: "LPT-44f690",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-fecc49",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "USDT-fedd98",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
                coingeckoId: "tether",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqskct0n779lg9decdw6gvzcsx3xmxganezh0q5m8grk",
        lpToken: {
            id: "LPT-8f1594",
            icon: "#fff",
            name: "LPT-8f1594",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-fecc49",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "WUSDC-f93edf",
                icon: IconWUSDC,
                name: "wUSDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq79zadfzu2gxdug2ztue6q6aa8xret9qszh0qzx5ncc",
        lpToken: {
            id: "LPT-0b4585",
            icon: "#fff",
            name: "LPT-0b4585",
            decimals: 18,
        },
        tokens: [
            {
                id: "RENBTC-8cd185",
                icon: IconBTC,
                name: "renBTC",
                decimals: 8,
                coingeckoId: "bitcoin",
            },
            {
                id: "WBTC-027977",
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

const pools = ENVIRONMENT.NETWORK == "devnet" ? [...devnet, ...MAIAR_POOLS] : testnet;

export default pools;
