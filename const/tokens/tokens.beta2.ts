import ImgAshIcon from "assets/images/ash-icon.png";
import IconBUSD from "assets/images/busd-icon.png";
import ImgEgldIcon from "assets/images/egld-icon.png";
import IconHSEGLD from "assets/images/hsegld-icon.png";
import IconLEGLD from "assets/images/legld-icon.png";
import IconHTM from "assets/images/htm-icon.png";
import IconSEGLD from "assets/images/segld-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import IconUTK from "assets/images/utk-icon.png";
import ImgWEGLDIcon from "assets/images/wegld-icon.png";
import IconEPUNKS from "assets/images/epunks-icon.png";
import IconPROTEO from "assets/images/proteo-icon.png";
import IconJWLASH from "assets/images/jwlash-icon.png";
import IconJWLEGLD from "assets/images/jwlegld-icon.png";
import IconMEX from "assets/images/mex-icon.png";
import IconJWLHTM from "assets/images/jwlhtm-icon.png";
import IconJWLMEX from "assets/images/jwlmex-icon.png";
import IconJWLUSD from "assets/images/jwlusd-icon.png";
import { ChainId, IESDTInfo } from "helper/token/token";
const TOKENS_ALIAS: Record<"EGLD" | "ASH" | "wEGLD", IESDTInfo> = {
    EGLD: {
        identifier: "EGLD",
        chainId: ChainId.Devnet,
        symbol: "xEGLD",
        name: "MultiversX",
        decimals: 18,
        logoURI: ImgEgldIcon.src,
    },
    wEGLD: {
        identifier: "WEGLD-a28c59",
        chainId: ChainId.Devnet,
        symbol: "wEGLD",
        name: "Wrapped EGLD",
        decimals: 18,
        logoURI: ImgWEGLDIcon.src,
    },
    ASH: {
        identifier: "ASH-e3d1b7",
        chainId: ChainId.Devnet,
        symbol: "ASH",
        name: "Ashswap Token",
        decimals: 18,
        logoURI: ImgAshIcon.src,
    },
};

const TOKENS: IESDTInfo[] = [
    TOKENS_ALIAS.EGLD,
    TOKENS_ALIAS.wEGLD,
    TOKENS_ALIAS.ASH,
    {
        identifier: "USDC-350c4e",
        chainId: ChainId.Devnet,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        logoURI: IconUSDC.src,
    },
    {
        identifier: "USDT-dd271a",
        chainId: ChainId.Devnet,
        symbol: "USDT",
        name: "Tether",
        decimals: 6,
        logoURI: IconUSDT.src,
    },
    {
        identifier: "USDT-58d5d0",
        chainId: ChainId.Devnet,
        symbol: "USDT",
        name: "Tether",
        decimals: 6,
        logoURI: IconUSDT.src,
    },
    {
        identifier: "BUSD-d4c014",
        chainId: ChainId.Devnet,
        symbol: "BUSD",
        name: "BUSD",
        decimals: 18,
        logoURI: IconBUSD.src,
    },
    {
        identifier: "HTM-23a1da",
        chainId: ChainId.Devnet,
        symbol: "HTM",
        name: "Hatom Protocol",
        decimals: 18,
        logoURI: IconHTM.src,
    },
    {
        identifier: "UTK-14d57d",
        chainId: ChainId.Devnet,
        symbol: "UTK",
        name: "Utrust",
        decimals: 18,
        logoURI: IconUTK.src,
    },
    {
        identifier: "JWLEGLD-e4b8d3",
        chainId: ChainId.Devnet,
        symbol: "JWLEGLD",
        name: "JewelLockedEGLD",
        decimals: 18,
        logoURI: IconJWLEGLD.src,
    },
    {
        identifier: "JWLHTM-3ed083",
        chainId: ChainId.Devnet,
        symbol: "JWLHTM",
        name: "JewelLockedHTM",
        decimals: 18,
        logoURI: IconJWLHTM.src,
    },
    {
        identifier: "JWLUSD-3d1fab",
        chainId: ChainId.Devnet,
        symbol: "JWLUSD",
        name: "JewelLockedUSD",
        decimals: 18,
        logoURI: IconJWLUSD.src,
    },
    {
        identifier: "SEGLD-f94c36",
        chainId: ChainId.Devnet,
        symbol: "sEGLD",
        name: "Liquid Staked EGLD",
        decimals: 18,
        logoURI: IconSEGLD.src,
    },
    {
        identifier: "EPUNKS-50d907",
        chainId: ChainId.Devnet,
        symbol: "EPUNKS",
        name: "ElrondPunks",
        decimals: 18,
        logoURI: IconEPUNKS.src,
    },
    {
        identifier: "PROTEO-6ca7c8",
        chainId: ChainId.Devnet,
        symbol: "PROTEO",
        name: "PROTEO",
        decimals: 18,
        logoURI: IconPROTEO.src,
    },
];

const LP_TOKENS: IESDTInfo[] = [
    // LP tokens
    {
        identifier: "ALP-a89380",
        chainId: ChainId.Devnet,
        symbol: "ALP-3pool",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-20e461",
        chainId: ChainId.Devnet,
        symbol: "ALP-BUSD-wEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-2d2663",
        chainId: ChainId.Devnet,
        symbol: "ALP-ASH-USDT",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-caeac5",
        chainId: ChainId.Devnet,
        symbol: "ALP-BUSD-UTK",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-097c45",
        chainId: ChainId.Devnet,
        symbol: "ALP-JWLEGLD-EGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-a2b238",
        chainId: ChainId.Devnet,
        symbol: "ALP-JWLHTM",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-7f4b3f",
        chainId: ChainId.Devnet,
        symbol: "ALP-JWLUSD-USDC",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-e4391a",
        chainId: ChainId.Devnet,
        symbol: "ALP-SEGLD-WEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-3763b9",
        chainId: ChainId.Devnet,
        symbol: "ALP-SEGLD-JWLEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-2be5ea",
        chainId: ChainId.Devnet,
        symbol: "ALP-JWLEGLD-EPUNKS",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-f5e6d8",
        chainId: ChainId.Devnet,
        symbol: "ALP-USDC-USDT",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-50c469",
        chainId: ChainId.Devnet,
        symbol: "ALP-USDT-WEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-47b8c2",
        chainId: ChainId.Devnet,
        symbol: "ALP-WEGLD-PROTEO",
        name: "Ashswap LP",
        decimals: 18,
    },
];

const TOKENS_MAP: Record<string, IESDTInfo> & typeof TOKENS_ALIAS = {
    ...Object.fromEntries(
        [...TOKENS, ...LP_TOKENS].map((t) => [t.identifier, t])
    ),
    ...TOKENS_ALIAS,
};
const TOKENS_BETA = {
    TOKENS,
    LP_TOKENS,
    TOKENS_MAP,
} as const;

export default TOKENS_BETA;
