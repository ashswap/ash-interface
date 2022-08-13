import ImgAshIcon from "assets/images/ash-icon.png";
import IconBTC from "assets/images/btc-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IconWUSDC from "assets/images/wusdc-icon.png";
import { ChainId, ESDT, IESDTInfo } from "helper/token/token";
import { ENVIRONMENT } from "./env";

export const VE_ASH_DECIMALS = 18;

const DEVNET_TOKENS: IESDTInfo[] = [
    {
        identifier: "ASH-4ce444",
        chainId: ChainId.Devnet,
        symbol: "ASH",
        name: "Ashswap Token",
        decimals: 18,
        logoURI: ImgAshIcon.src,
    },
    {
        identifier: "USDT-a55fa7",
        chainId: ChainId.Devnet,
        symbol: "USDT",
        name: "Tether",
        decimals: 6,
        logoURI: IconUSDT.src,
    },
    {
        identifier: "USDC-d5181d",
        chainId: ChainId.Devnet,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        logoURI: IconUSDC.src,
    },
    {
        identifier: "WUSDC-3124eb",
        chainId: ChainId.Devnet,
        symbol: "wUSDC",
        name: "Wrapped USDC",
        decimals: 6,
        logoURI: IconWUSDC.src,
    },
    {
        identifier: "RENBTC-0b6973",
        chainId: ChainId.Devnet,
        symbol: "renBTC",
        name: "Ren BTC",
        decimals: 8,
        logoURI: IconBTC.src,
    },
    {
        identifier: "WBTC-9bdb9b",
        chainId: ChainId.Devnet,
        symbol: "wBTC",
        name: "Wrapped BTC",
        decimals: 8,
        logoURI: IconWBTC.src,
    },
];

const TESTNET_TOKENS: IESDTInfo[] = [
    {
        identifier: "ASH-f01858",
        chainId: ChainId.Testnet,
        symbol: "ASH",
        name: "Ashswap Token",
        decimals: 18,
        logoURI: ImgAshIcon.src,
    },
    {
        identifier: "USDT-8d1668",
        chainId: ChainId.Testnet,
        symbol: "USDT",
        name: "Tether",
        decimals: 6,
        logoURI: IconUSDT.src,
    },
    {
        identifier: "USDC-cbf0b9",
        chainId: ChainId.Testnet,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        logoURI: IconUSDC.src,
    },
    {
        identifier: "WUSDC-365a33",
        chainId: ChainId.Testnet,
        symbol: "wUSDC",
        name: "Wrapped USDC",
        decimals: 6,
        logoURI: IconWUSDC.src,
    },
    {
        identifier: "RENBTC-36935a",
        chainId: ChainId.Testnet,
        symbol: "renBTC",
        name: "Ren BTC",
        decimals: 8,
        logoURI: IconBTC.src,
    },
    {
        identifier: "WBTC-ebec12",
        chainId: ChainId.Testnet,
        symbol: "wBTC",
        name: "Wrapped BTC",
        decimals: 8,
        logoURI: IconWBTC.src,
    },
];

export const TOKENS =
    ENVIRONMENT.NETWORK === "devnet" ? DEVNET_TOKENS : TESTNET_TOKENS;
/**@deprecate */
export const TOKENS_MAP = Object.fromEntries(
    TOKENS.map((t) => [t.identifier, t])
);
/**@deprecate */
export const ASH_TOKEN: IESDTInfo =
    TOKENS_MAP[ENVIRONMENT.NETWORK == "devnet" ? "ASH-4ce444" : "ASH-f01858"];
export const ESDT_MAP = Object.fromEntries(TOKENS.map((t) => [t.identifier, new ESDT(t)]));
export const ASH_ESDT = ESDT_MAP[ENVIRONMENT.NETWORK == "devnet" ? "ASH-4ce444" : "ASH-f01858"];