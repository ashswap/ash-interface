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
            "erd1qqqqqqqqqqqqqpgqycvysm6mdrdls3nqvpgademdc7kvapvmzh0qv78flx",
        lpToken: {
            id: "LPT-2897ed",
            icon: "#fff",
            name: "LPT-2897ed",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-d6c57a",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "USDT-2f78fb",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
                coingeckoId: "tether",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqwf5e9c8r9rvspdwmnd3egkh82rs68rd9zh0qc5m7gw",
        lpToken: {
            id: "LPT-4c3309",
            icon: "#fff",
            name: "LPT-4c3309",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-d6c57a",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "WUSDC-c01108",
                icon: IconWUSDC,
                name: "wUSDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqdauw2t0tjs5tgqef2cec5gdglpantctazh0qnr48zk",
        lpToken: {
            id: "LPT-4236a8",
            icon: "#fff",
            name: "LPT-4236a8",
            decimals: 18,
        },
        tokens: [
            {
                id: "BTC-573344",
                icon: IconBTC,
                name: "BTC",
                decimals: 6,
                coingeckoId: "bitcoin",
            },
            {
                id: "WBTC-3a02ea",
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
