import ImgAshIcon from "assets/images/ash-icon.png";
import IconBTC from "assets/images/btc-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IconWUSDC from "assets/images/wusdc-icon.png";
import IconBUSD from "assets/images/busd-icon.png";
import IconWEGLD from "assets/images/wegld-icon-boy.png";
import IconAEGLD from "assets/images/aegld-icon.png";
import { ChainId, ESDT, IESDTInfo } from "helper/token/token";
import { ENVIRONMENT } from "./env";

export const VE_ASH_DECIMALS = 18;

const DEVNET_TOKENS_ALPHA: IESDTInfo[] = [
    {
        identifier: "ASH-a0d8e5",
        chainId: ChainId.Devnet,
        symbol: "ASH",
        name: "Ashswap Token",
        decimals: 18,
        logoURI: ImgAshIcon.src,
    },
    {
        identifier: "USDT-2c4852",
        chainId: ChainId.Devnet,
        symbol: "USDT",
        name: "Tether",
        decimals: 6,
        logoURI: IconUSDT.src,
    },
    {
        identifier: "USDC-89351f",
        chainId: ChainId.Devnet,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        logoURI: IconUSDC.src,
    },
    {
        identifier: "BUSD-104d95",
        chainId: ChainId.Devnet,
        symbol: "BUSD",
        name: "Binance USD",
        decimals: 6,
        logoURI: IconBUSD.src,
    },
    {
        identifier: "RENBTC-61ff58",
        chainId: ChainId.Devnet,
        symbol: "renBTC",
        name: "Ren BTC",
        decimals: 8,
        logoURI: IconBTC.src,
    },
    {
        identifier: "WBTC-3965ad",
        chainId: ChainId.Devnet,
        symbol: "wBTC",
        name: "Wrapped BTC",
        decimals: 8,
        logoURI: IconWBTC.src,
    },
    {
        identifier: "WEGLD-d6dee7",
        chainId: ChainId.Devnet,
        symbol: "wEGLD",
        name: "Wrapped EGLD",
        decimals: 18,
        logoURI: IconWEGLD.src,
    },
    {
        identifier: "AEGLD-3e2d88",
        chainId: ChainId.Devnet,
        symbol: "aEGLD",
        name: "A EGLD",
        decimals: 18,
        logoURI: IconAEGLD.src,
    },
];
const DEVNET_TOKENS_BETA: IESDTInfo[] = [
    {
        identifier: "ASH-77a5df",
        chainId: ChainId.Devnet,
        symbol: "ASH",
        name: "Ashswap Token",
        decimals: 18,
        logoURI: ImgAshIcon.src,
    },
    {
        identifier: "USDT-324eda",
        chainId: ChainId.Devnet,
        symbol: "USDT",
        name: "Tether",
        decimals: 6,
        logoURI: IconUSDT.src,
    },
    {
        identifier: "USDC-6c5d88",
        chainId: ChainId.Devnet,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        logoURI: IconUSDC.src,
    },
    {
        identifier: "WUSDC-232e24",
        chainId: ChainId.Devnet,
        symbol: "wUSDC",
        name: "Wrapped USD Coin",
        decimals: 6,
        logoURI: IconWUSDC.src,
    },
    {
        identifier: "RENBTC-a74396",
        chainId: ChainId.Devnet,
        symbol: "renBTC",
        name: "Ren BTC",
        decimals: 8,
        logoURI: IconBTC.src,
    },
    {
        identifier: "WBTC-1297c1",
        chainId: ChainId.Devnet,
        symbol: "wBTC",
        name: "Wrapped BTC",
        decimals: 8,
        logoURI: IconWBTC.src,
    },
    {
        identifier: "WEGLD-795247",
        chainId: ChainId.Devnet,
        symbol: "wEGLD",
        name: "Wrapped EGLD",
        decimals: 18,
        logoURI: IconWEGLD.src,
    },
    {
        identifier: "AEGLD-f09e97",
        chainId: ChainId.Devnet,
        symbol: "aEGLD",
        name: "A EGLD",
        decimals: 18,
        logoURI: IconAEGLD.src,
    },
];

const MAINNET_TOKENS: IESDTInfo[] = [
    {
        identifier: "ASH-a85626",
        chainId: ChainId.Mainnet,
        symbol: "ASH",
        name: "Ashswap Token",
        decimals: 18,
        logoURI: ImgAshIcon.src,
    },
    {
        identifier: "USDT-821a84",
        chainId: ChainId.Mainnet,
        symbol: "USDT",
        name: "Tether",
        decimals: 6,
        logoURI: IconUSDT.src,
    },
    {
        identifier: "USDC-bb1e62",
        chainId: ChainId.Mainnet,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        logoURI: IconUSDC.src,
    },
    {
        identifier: "BUSD-7f6b0f",
        chainId: ChainId.Mainnet,
        symbol: "BUSD",
        name: "Binance USD",
        decimals: 6,
        logoURI: IconBUSD.src,
    },
    {
        identifier: "RENBTC-9179c8",
        chainId: ChainId.Mainnet,
        symbol: "renBTC",
        name: "Ren BTC",
        decimals: 8,
        logoURI: IconBTC.src,
    },
    {
        identifier: "WBTC-2d9033",
        chainId: ChainId.Mainnet,
        symbol: "wBTC",
        name: "Wrapped BTC",
        decimals: 8,
        logoURI: IconWBTC.src,
    },
    {
        identifier: "WEGLD-795247",
        chainId: ChainId.Mainnet,
        symbol: "wEGLD",
        name: "Wrapped EGLD",
        decimals: 18,
        logoURI: IconWEGLD.src,
    },
    {
        identifier: "AEGLD-a1f5d4",
        chainId: ChainId.Mainnet,
        symbol: "aEGLD",
        name: "AEGLD",
        decimals: 18,
        logoURI: IconAEGLD.src,
    },
];

export const TOKENS =
    ENVIRONMENT.NETWORK === "devnet"
        ? ENVIRONMENT.ENV === "alpha"
            ? DEVNET_TOKENS_ALPHA
            : DEVNET_TOKENS_BETA
        : MAINNET_TOKENS;
/**@deprecate */
export const TOKENS_MAP = Object.fromEntries(
    TOKENS.map((t) => [t.identifier, t])
);
/**@deprecate */
export const ASH_TOKEN: IESDTInfo =
    TOKENS_MAP[
        ENVIRONMENT.NETWORK == "devnet"
            ? ENVIRONMENT.ENV === "alpha"
                ? "ASH-a0d8e5"
                : "ASH-77a5df"
            : "ASH-a85626"
    ];
export const ESDT_MAP = Object.fromEntries(
    TOKENS.map((t) => [t.identifier, new ESDT(t)])
);
export const ASH_ESDT =
    ESDT_MAP[
        ENVIRONMENT.NETWORK == "devnet"
            ? ENVIRONMENT.ENV === "alpha"
                ? "ASH-a0d8e5"
                : "ASH-77a5df"
            : "ASH-a85626"
    ];
