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
            "erd1qqqqqqqqqqqqqpgqdyhs77hwcelsdwtdqee5g9g68y4lcy7rzh0q2kxnex",
        lpToken: {
            id: "LPT-d6d2a2",
            icon: "#fff",
            name: "LPT-d6d2a2",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-ae1f6d",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "USDT-b070dd",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
                coingeckoId: "tether",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq99xgtkmp0je582r78f4u6jaad5qtyxu4zh0q6ctfly",
        lpToken: {
            id: "LPT-5448e9",
            icon: "#fff",
            name: "LPT-5448e9",
            decimals: 18,
        },
        tokens: [
            {
                id: "USDC-ae1f6d",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
            {
                id: "WUSDC-985985",
                icon: IconWUSDC,
                name: "wUSDC",
                decimals: 6,
                coingeckoId: "usd-coin",
            },
        ],
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq9wxtzqmcfqh9ll58t5u9dtv8c827q8pfzh0q8lcm4e",
        lpToken: {
            id: "LPT-58c291",
            icon: "#fff",
            name: "LPT-58c291",
            decimals: 18,
        },
        tokens: [
            {
                id: "RENBTC-336778",
                icon: IconBTC,
                name: "renBTC",
                decimals: 8,
                coingeckoId: "bitcoin",
            },
            {
                id: "WBTC-2d09a6",
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
