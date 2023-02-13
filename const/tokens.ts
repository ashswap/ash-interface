import ImgAshIcon from "assets/images/ash-icon.png";
import ImgWEGLDIcon from "assets/images/wEGLD-icon.png";
import ImgEgldIcon from "assets/images/egld-icon.png";
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
        identifier: "EGLD",
        chainId: ChainId.Devnet,
        symbol: "xEGLD",
        name: "MultiversX",
        decimals: 18,
        logoURI: ImgEgldIcon.src,
    },
    {
        identifier: "WEGLD-d7c6bb",
        chainId: ChainId.Devnet,
        symbol: "wEGLD",
        name: "Wrapped EGLD",
        decimals: 18,
        logoURI: ImgWEGLDIcon.src,
    },
    {
        identifier: "ASH-84eab0",
        chainId: ChainId.Devnet,
        symbol: "ASH",
        name: "Ashswap Token",
        decimals: 18,
        logoURI: ImgAshIcon.src,
    },
    {
        identifier: "USDT-3e3720",
        chainId: ChainId.Devnet,
        symbol: "USDT",
        name: "Tether",
        decimals: 6,
        logoURI: IconUSDT.src,
    },
    {
        identifier: "USDC-fd47e9",
        chainId: ChainId.Devnet,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        logoURI: IconUSDC.src,
    },
    {
        identifier: "BUSD-b53884",
        chainId: ChainId.Devnet,
        symbol: "BUSD",
        name: "Binance USD",
        decimals: 18,
        logoURI: IconBUSD.src,
    },
    {
        identifier: "WEGLD-578a26",
        chainId: ChainId.Devnet,
        symbol: "wEGLD",
        name: "Wrapped EGLD",
        decimals: 18,
        logoURI: IconWEGLD.src,
    },
    {
        identifier: "AEGLD-126d13",
        chainId: ChainId.Devnet,
        symbol: "aEGLD",
        name: "A EGLD",
        decimals: 18,
        logoURI: IconAEGLD.src,
    },
];
const DEVNET_TOKENS_BETA: IESDTInfo[] = [
    {
        identifier: "EGLD",
        chainId: ChainId.Devnet,
        symbol: "xEGLD",
        name: "MultiversX",
        decimals: 18,
        logoURI: ImgEgldIcon.src,
    },
    {
        identifier: "WEGLD-d7c6bb",
        chainId: ChainId.Devnet,
        symbol: "wEGLD",
        name: "Wrapped EGLD",
        decimals: 18,
        logoURI: ImgWEGLDIcon.src,
    },
    {
        identifier: "ASH-4ce444",
        chainId: ChainId.Devnet,
        symbol: "ASH",
        name: "Ashswap Token",
        decimals: 18,
        logoURI: ImgAshIcon.src,
    },
    {
        identifier: "USDC-8d4068",
        chainId: ChainId.Devnet,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        logoURI: IconUSDC.src,
    },
    {
        identifier: "USDT-188935",
        chainId: ChainId.Devnet,
        symbol: "USDT",
        name: "Tether",
        decimals: 6,
        logoURI: IconUSDT.src,
    },
    {
        identifier: "BUSD-632f7d",
        chainId: ChainId.Devnet,
        symbol: "BUSD",
        name: "BUSD",
        decimals: 18,
        logoURI: IconBUSD.src,
    },
];

const MAINNET_TOKENS: IESDTInfo[] = [
    {
        identifier: "EGLD",
        chainId: ChainId.Mainnet,
        symbol: "EGLD",
        name: "MultiversX",
        decimals: 18,
        logoURI: ImgEgldIcon.src,
    },
    {
        identifier: "WEGLD-bd4d79",
        chainId: ChainId.Mainnet,
        symbol: "wEGLD",
        name: "Wrapped EGLD",
        decimals: 18,
        logoURI: ImgWEGLDIcon.src,
    },
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
        identifier: "USDT-f8c08c",
        chainId: ChainId.Mainnet,
        symbol: "rUSDT",
        name: "Tether",
        decimals: 6,
        logoURI: IconUSDT.src,
    },
    {
        identifier: "USDC-c76f1f",
        chainId: ChainId.Mainnet,
        symbol: "rUSDC",
        name: "USD Coin",
        decimals: 6,
        logoURI: IconUSDC.src,
    },
    {
        identifier: "BUSD-40b57e",
        chainId: ChainId.Mainnet,
        symbol: "rBUSD",
        name: "Binance USD",
        decimals: 18,
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
                ? "ASH-84eab0"
                : "ASH-4ce444"
            : "ASH-a85626"
    ];
export const ESDT_MAP = Object.fromEntries(
    TOKENS.map((t) => [t.identifier, new ESDT(t)])
);
export const ASH_ESDT =
    ESDT_MAP[
        ENVIRONMENT.NETWORK == "devnet"
            ? ENVIRONMENT.ENV === "alpha"
                ? "ASH-84eab0"
                : "ASH-4ce444"
            : "ASH-a85626"
    ];
