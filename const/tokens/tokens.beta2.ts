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
import IconJWLASH from "assets/images/jwlash-icon.png";
import IconJWLEGLD from "assets/images/jwlegld-icon.png";
import IconMEX from "assets/images/mex-icon.png";
import IconJWLHTM from "assets/images/jwlhtm-icon.png";
import IconJWLMEX from "assets/images/jwlmex-icon.png";
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
        identifier: "BUSD-d4c014",
        chainId: ChainId.Devnet,
        symbol: "BUSD",
        name: "BUSD",
        decimals: 18,
        logoURI: IconBUSD.src,
    },
    {
        identifier: "UTK-14d57d",
        chainId: ChainId.Devnet,
        symbol: "UTK",
        name: "Utrust",
        decimals: 18,
        logoURI: IconUTK.src,
    },
];

const LP_TOKENS: IESDTInfo[] = [
    // LP tokens
    {
        identifier: "ALP-c18629",
        chainId: ChainId.Devnet,
        symbol: "ALP-3pool",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-fe666f",
        chainId: ChainId.Devnet,
        symbol: "ALP-BUSD-wEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-55d5c4",
        chainId: ChainId.Devnet,
        symbol: "ALP-ASH-USDT",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-2c3abb",
        chainId: ChainId.Devnet,
        symbol: "ALP-BUSD-UTK",
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
