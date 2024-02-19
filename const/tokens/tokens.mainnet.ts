import ImgAshIcon from "assets/images/ash-icon.png";
import IconBUSD from "assets/images/busd-icon.png";
import ImgEgldIcon from "assets/images/egld-icon.png";
import IconSEGLD from "assets/images/segld-icon.png";
import IconHSEGLD from "assets/images/hsegld-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import ImgWEGLDIcon from "assets/images/wegld-icon.png";
import IconHTM from "assets/images/htm-icon.png";
import IconCGO from "assets/images/cgo-icon.png";
import IconMEX from "assets/images/mex-icon.png";
import IconUTK from "assets/images/utk-icon.png";
import IconEPUNKS from "assets/images/epunks-icon.png";
import IconWSDAI from "assets/images/wsdai-icon.png";
import IconDNA from "assets/images/dna-icon.png";
import IconDAI from "assets/images/dai-icon.png";
import IconAPUSDC from "assets/images/apusdc-icon.png";
import IconJWLASH from "assets/images/jwlash-icon.png";
import IconJWLEGLD from "assets/images/jwlegld-icon.png";
import IconJWLHTM from "assets/images/jwlhtm-icon.png";
import IconJWLMEX from "assets/images/jwlmex-icon.png";
import IconJWLUSD from "assets/images/jwlusd-icon.png";
import IconJWLUTK from "assets/images/jwlutk-icon.png";
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
};
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
    {
        identifier: "HSEGLD-c13a4e",
        chainId: ChainId.Mainnet,
        symbol: "HsEGLD",
        name: "Hatom SEGLD",
        decimals: 8,
        logoURI: IconHSEGLD.src,
    },
    {
        identifier: "JWLASH-f362b9",
        chainId: ChainId.Mainnet,
        symbol: "JWLASH",
        name: "JewelLockedASH",
        decimals: 18,
        logoURI: IconJWLASH.src,
    },
    {
        identifier: "JWLEGLD-023462",
        chainId: ChainId.Mainnet,
        symbol: "JWLEGLD",
        name: "JewelLockedEGLD",
        decimals: 18,
        logoURI: IconJWLEGLD.src,
    },
    {
        identifier: "CGO-5e9528",
        chainId: ChainId.Mainnet,
        symbol: "CGO",
        name: "CathenaGold",
        decimals: 18,
        logoURI: IconCGO.src,
    },
    {
        identifier: "JWLHTM-8e3cd5",
        chainId: ChainId.Mainnet,
        symbol: "JWLHTM",
        name: "JewelLockedHTM",
        decimals: 18,
        logoURI: IconJWLHTM.src,
    },
    {
        identifier: "HTM-f51d55",
        chainId: ChainId.Mainnet,
        symbol: "HTM",
        name: "Hatom Protocol",
        decimals: 18,
        logoURI: IconHTM.src,
    },
    {
        identifier: "MEX-455c57",
        chainId: ChainId.Mainnet,
        symbol: "MEX",
        name: "xExchange",
        decimals: 18,
        logoURI: IconMEX.src,
    },
    {
        identifier: "UTK-2f80e9",
        chainId: ChainId.Devnet,
        symbol: "UTK",
        name: "Utrust",
        decimals: 18,
        logoURI: IconUTK.src,
    },
    {
        identifier: "JWLMEX-ef8788",
        chainId: ChainId.Mainnet,
        symbol: "JWLMEX",
        name: "JewelLockedMEX",
        decimals: 18,
        logoURI: IconJWLMEX.src,
    },
    {
        identifier: "JWLUSD-62939e",
        chainId: ChainId.Mainnet,
        symbol: "JWLUSD",
        name: "JewelLockedUSD",
        decimals: 18,
        logoURI: IconJWLUSD.src,
    },
    {
        identifier: "JWLUTK-2a518c",
        chainId: ChainId.Mainnet,
        symbol: "JWLUTK",
        name: "JewelLockedUTK",
        decimals: 18,
        logoURI: IconJWLUTK.src,
    },
    {
        identifier: "WSDAI-277fee",
        chainId: ChainId.Mainnet,
        symbol: "WSDAI",
        name: "WrappedSDAI",
        decimals: 18,
        logoURI: IconWSDAI.src,
    },
    {
        identifier: "EPUNKS-dc0f59",
        chainId: ChainId.Mainnet,
        symbol: "EPUNKS",
        name: "ElrondPunks",
        decimals: 18,
        logoURI: IconEPUNKS.src,
    },
    {
        identifier: "DNA-b144d1",
        chainId: ChainId.Mainnet,
        symbol: "DNA",
        name: "DNA",
        decimals: 18,
        logoURI: IconDNA.src,
    },
    {
        identifier: "WDAI-9eeb54",
        chainId: ChainId.Mainnet,
        symbol: "WDAI",
        name: "WDAI",
        decimals: 18,
        logoURI: IconDAI.src,
    },
    {
        identifier: "APUSDC-1ac537",
        chainId: ChainId.Mainnet,
        symbol: "APUSDC",
        name: "APUSDC",
        decimals: 18,
        logoURI: IconAPUSDC.src,
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
    {
        identifier: "ALP-796121",
        chainId: ChainId.Mainnet,
        symbol: "ALP-HSEGLD-SEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-f7dee1",
        chainId: ChainId.Mainnet,
        symbol: "ALP-ASH-JWLASH",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-713ae8",
        chainId: ChainId.Mainnet,
        symbol: "ALP-WEGLD-JWLEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-d97011",
        chainId: ChainId.Mainnet,
        symbol: "ALP-WEGLD-CGO",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-0ed700",
        chainId: ChainId.Mainnet,
        symbol: "ALP-JWLHTM",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-2265f4",
        chainId: ChainId.Mainnet,
        symbol: "ALP-JWLEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-deda92",
        chainId: ChainId.Mainnet,
        symbol: "ALP-JWLMEX",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-fe21d9",
        chainId: ChainId.Mainnet,
        symbol: "ALP-JWLUSD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-20179e",
        chainId: ChainId.Mainnet,
        symbol: "ALP-JWLUTK",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-487964",
        chainId: ChainId.Mainnet,
        symbol: "ALP-JWLUSD-WSDAI",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-0f46fa",
        chainId: ChainId.Mainnet,
        symbol: "ALP-JWLEGLD-EPUNKS",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-92992e",
        chainId: ChainId.Mainnet,
        symbol: "ALP-USDC-DNA",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-19d6c0",
        chainId: ChainId.Mainnet,
        symbol: "ALP-2USDC",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-8d8415",
        chainId: ChainId.Mainnet,
        symbol: "ALP-USDC-WEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-25b383",
        chainId: ChainId.Mainnet,
        symbol: "ALP-JWLUSD-JWLEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-45512a",
        chainId: ChainId.Mainnet,
        symbol: "ALP-USDT-WDAI-JWLUSD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-1d3ebc",
        chainId: ChainId.Mainnet,
        symbol: "ALP-APUSDC-USDC",
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
const TOKENS_MAINNET = {
    TOKENS,
    LP_TOKENS,
    TOKENS_MAP,
} as const;

export default TOKENS_MAINNET;
