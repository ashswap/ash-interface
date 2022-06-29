import ImgAshIcon from "assets/images/ash-icon.png";
import IconBTC from "assets/images/btc-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IconWUSDC from "assets/images/wusdc-icon.png";
import { IToken } from "interface/token";
import { CHAIN_ID } from "./dappConfig";
import { ENVIRONMENT } from "./env";
const { MAINNET, TESTNET, DEVNET } = CHAIN_ID;

export const VE_ASH_DECIMALS = 18;

const DEVNET_TOKENS: IToken[] = [
    {
        id: "ASH-4ce444",
        chainId: DEVNET,
        symbol: "ASH",
        name: "Ashswap Token",
        decimals: 18,
        icon: ImgAshIcon,
    },
    {
        id: "USDT-a55fa7",
        chainId: DEVNET,
        symbol: "USDT",
        name: "Tether",
        decimals: 6,
        coingeckoId: "tether",
        icon: IconUSDT,
    },
    {
        id: "USDC-d5181d",
        chainId: DEVNET,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        coingeckoId: "usd-coin",
        icon: IconUSDC,
    },
    {
        id: "WUSDC-3124eb",
        chainId: DEVNET,
        symbol: "wUSDC",
        name: "Wrapped USDC",
        decimals: 6,
        coingeckoId: "usd-coin",
        icon: IconWUSDC,
    },
    {
        id: "RENBTC-0b6973",
        chainId: DEVNET,
        symbol: "renBTC",
        name: "Ren BTC",
        decimals: 8,
        coingeckoId: "bitcoin",
        icon: IconBTC,
    },
    {
        id: "WBTC-9bdb9b",
        chainId: DEVNET,
        symbol: "wBTC",
        name: "Wrapped BTC",
        decimals: 8,
        coingeckoId: "wrapped-bitcoin",
        icon: IconWBTC,
    },
];

const TESTNET_TOKENS: IToken[] = [
    {
        id: "ASH-4ce444",
        chainId: TESTNET,
        symbol: "ASH",
        name: "Ashswap Token",
        decimals: 18,
        icon: ImgAshIcon,
    },
    {
        id: "USDT-8d1668",
        chainId: TESTNET,
        symbol: "USDT",
        name: "Tether",
        decimals: 6,
        coingeckoId: "tether",
        icon: IconUSDT,
    },
    {
        id: "USDC-cbf0b9",
        chainId: TESTNET,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        coingeckoId: "usd-coin",
        icon: IconUSDC,
    },
    {
        id: "WUSDC-365a33",
        chainId: TESTNET,
        symbol: "wUSDC",
        name: "Wrapped USDC",
        decimals: 6,
        coingeckoId: "usd-coin",
        icon: IconWUSDC,
    },
    {
        id: "RENBTC-36935a",
        chainId: TESTNET,
        symbol: "renBTC",
        name: "Ren BTC",
        decimals: 8,
        coingeckoId: "bitcoin",
        icon: IconBTC,
    },
    {
        id: "WBTC-ebec12",
        chainId: TESTNET,
        symbol: "wBTC",
        name: "Wrapped BTC",
        decimals: 8,
        coingeckoId: "wrapped-bitcoin",
        icon: IconWBTC,
    },
];

export const TOKENS =
    ENVIRONMENT.NETWORK === "devnet" ? DEVNET_TOKENS : TESTNET_TOKENS;
export const TOKENS_MAP = Object.fromEntries(TOKENS.map((t) => [t.id, t]));
export const ASH_TOKEN: IToken =
    TOKENS_MAP[ENVIRONMENT.NETWORK == "devnet" ? "ASH-4ce444" : "ASH-f01858"];
