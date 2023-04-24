import ImgAshIcon from "assets/images/ash-icon.png";
import ImgWEGLDIcon from "assets/images/wegld-icon.png";
import ImgEgldIcon from "assets/images/egld-icon.png";
import IconBTC from "assets/images/btc-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IconWUSDC from "assets/images/wusdc-icon.png";
import IconBUSD from "assets/images/busd-icon.png";
import IconWEGLD from "assets/images/wegld-icon-boy.png";
import IconSEGLD from "assets/images/segld-icon.png";
import IconHSEGLD from "assets/images/hsegld-icon.png";
import IconAEGLD from "assets/images/aegld-icon.png";
import IconUTK from "assets/images/utk-icon.png";
import IconHTM from "assets/images/htm-icon.png";
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
        identifier: "SEGLD-b8ba9a",
        chainId: ChainId.Devnet,
        symbol: "sEGLD",
        name: "Liquid Staked EGLD",
        decimals: 18,
        logoURI: IconSEGLD.src,
    },
    {
        identifier: "AEGLD-581e63",
        chainId: ChainId.Devnet,
        symbol: "aEGLD",
        name: "A EGLD",
        decimals: 18,
        logoURI: IconAEGLD.src,
    },
    {
        identifier: "AUSD-47f281",
        chainId: ChainId.Devnet,
        symbol: "aUSD",
        name: "A USD",
        decimals: 18,
        logoURI: "",
    },
    // LP Tokens
    {
        identifier: "ALP-cc035f",
        chainId: ChainId.Devnet,
        symbol: "LPT-3pool",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-543842",
        chainId: ChainId.Devnet,
        symbol: "LPT-BUSD-wEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-6bb819",
        chainId: ChainId.Devnet,
        symbol: "LPT-AUSD-3Pool",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-193fb4",
        chainId: ChainId.Devnet,
        symbol: "LPT-ASH-USDT",
        name: "Ashswap LP",
        decimals: 18,
    }
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
    {
        identifier: "HTM-fe1f69",
        chainId: ChainId.Devnet,
        symbol: "HTM",
        name: "Hatom Protocol",
        decimals: 18,
        logoURI: IconHTM.src,
    },
    {
        identifier: "UTK-a2a792",
        chainId: ChainId.Devnet,
        symbol: "UTK",
        name: "Utrust",
        decimals: 18,
        logoURI: IconUTK.src,
    },
    {
        identifier: "SEGLD-90b353",
        chainId: ChainId.Devnet,
        symbol: "sEGLD",
        name: "Liquid Staked EGLD",
        decimals: 18,
        logoURI: IconSEGLD.src,
    },
    {
        identifier: "HSEGLD-8f2360",
        chainId: ChainId.Devnet,
        symbol: "HsEGLD",
        name: "Hatom sEGLD",
        decimals: 8,
        logoURI: IconHSEGLD.src,
    },
    // LP tokens
    {
        identifier: "ALP-9b7a73",
        chainId: ChainId.Devnet,
        symbol: "ALP-3pool",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-6b7c94",
        chainId: ChainId.Devnet,
        symbol: "ALP-BUSD-wEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-0e6b1c",
        chainId: ChainId.Devnet,
        symbol: "ALP-ASH-USDT",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-3c3066",
        chainId: ChainId.Devnet,
        symbol: "ALP-BUSD-UTK",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-b9e453",
        chainId: ChainId.Devnet,
        symbol: "ALP-USDT-HTM",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-bf3d53",
        chainId: ChainId.Devnet,
        symbol: "ALP-sEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-9836b4",
        chainId: ChainId.Devnet,
        symbol: "ALP-HsEGLD",
        name: "Ashswap LP",
        decimals: 18,
    }
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
        identifier: "ASH-a642d1",
        chainId: ChainId.Mainnet,
        symbol: "ASH",
        name: "Ashswap Token",
        decimals: 18,
        logoURI: ImgAshIcon.src,
    },
    {
        identifier: "USDT-f8c08c",
        chainId: ChainId.Mainnet,
        symbol: "USDT",
        name: "Tether",
        decimals: 6,
        logoURI: IconUSDT.src,
    },
    {
        identifier: "USDC-c76f1f",
        chainId: ChainId.Mainnet,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        logoURI: IconUSDC.src,
    },
    {
        identifier: "BUSD-40b57e",
        chainId: ChainId.Mainnet,
        symbol: "BUSD",
        name: "Binance USD",
        decimals: 18,
        logoURI: IconBUSD.src,
    },
    // LP Tokens
    {
        identifier: "ALP-afc922",
        chainId: ChainId.Mainnet,
        symbol: "ALP-3pool",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-5f9191",
        chainId: ChainId.Mainnet,
        symbol: "ALP-BUSD-WEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-2d0cf8",
        chainId: ChainId.Mainnet,
        symbol: "ALP-USDT-ASH",
        name: "Ashswap LP",
        decimals: 18,
    }
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
            : "ASH-a642d1"
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
            : "ASH-a642d1"
    ];
