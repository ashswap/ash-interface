import ImgAshIcon from "assets/images/ash-icon.png";
import IconBUSD from "assets/images/busd-icon.png";
import ImgEgldIcon from "assets/images/egld-icon.png";
import IconSEGLD from "assets/images/segld-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import ImgWEGLDIcon from "assets/images/wegld-icon.png";
import { ChainId, IESDTInfo } from "helper/token/token";
const TOKENS_ALIAS: Record<"EGLD" | "ASH" | "wEGLD", IESDTInfo> = {
    EGLD: {
        identifier: "EGLD",
        chainId: ChainId.Mainnet,
        symbol: "EGLD",
        name: "MultiversX",
        decimals: 18,
        logoURI: ImgEgldIcon.src,
    },
    wEGLD: {
        identifier: "WEGLD-bd4d79",
        chainId: ChainId.Mainnet,
        symbol: "wEGLD",
        name: "Wrapped EGLD",
        decimals: 18,
        logoURI: ImgWEGLDIcon.src,
    },
    ASH: {
        identifier: "ASH-a642d1",
        chainId: ChainId.Mainnet,
        symbol: "ASH",
        name: "Ashswap Token",
        decimals: 18,
        logoURI: ImgAshIcon.src,
    },
}
const TOKENS: IESDTInfo[] = [
    TOKENS_ALIAS.EGLD,
    TOKENS_ALIAS.wEGLD,
    TOKENS_ALIAS.ASH,
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
    {
        identifier: "SEGLD-3ad2d0",
        chainId: ChainId.Mainnet,
        symbol: "sEGLD",
        name: "Liquid Staked EGLD",
        decimals: 18,
        logoURI: IconSEGLD.src,
    },
];

const LP_TOKENS: IESDTInfo[] = [
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
    },
    {
        identifier: "ALP-0fe50a",
        chainId: ChainId.Mainnet,
        symbol: "ALP-WEGLD-SEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
];

const TOKENS_MAP: Record<string, IESDTInfo> &
    typeof TOKENS_ALIAS = {
    ...Object.fromEntries([...TOKENS, ...LP_TOKENS].map((t) => [t.identifier, t])),
    ...TOKENS_ALIAS,
};
const TOKENS_MAINNET = {
    TOKENS,
    LP_TOKENS,
    TOKENS_MAP,
} as const;

export default TOKENS_MAINNET;
