import ImgAshIcon from "assets/images/ash-icon.png";
import IconBUSD from "assets/images/busd-icon.png";
import ImgEgldIcon from "assets/images/egld-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import ImgWEGLDIcon from "assets/images/wegld-icon.png";
import IconHTM from "assets/images/htm-icon.png";
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
        identifier: "WEGLD-795247",
        chainId: ChainId.Mainnet,
        symbol: "wEGLD",
        name: "Wrapped EGLD",
        decimals: 18,
        logoURI: ImgWEGLDIcon.src,
    },
    ASH: {
        identifier: "ASH-a85626",
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
        identifier: "BUSD-2cbb2d",
        chainId: ChainId.Mainnet,
        symbol: "BUSD",
        name: "Binance USD",
        decimals: 18,
        logoURI: IconBUSD.src,
    },
    {
        identifier: "AHTM-27a91c",
        chainId: ChainId.Devnet,
        symbol: "HTM",
        name: "Hatom Protocol",
        decimals: 18,
        logoURI: IconHTM.src,
    },
];

const LP_TOKENS: IESDTInfo[] = [
    // LP Tokens
    {
        identifier: "ALP-c12752",
        chainId: ChainId.Mainnet,
        symbol: "ALP-3pool",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-d935a5",
        chainId: ChainId.Mainnet,
        symbol: "ALP-BUSD-WEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-c0b453",
        chainId: ChainId.Mainnet,
        symbol: "ALP-USDT-ASH",
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
