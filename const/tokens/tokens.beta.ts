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
import IconJWLHTM from "assets/images/jwlhtm-icon.png";
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
        identifier: "WEGLD-d7c6bb",
        chainId: ChainId.Devnet,
        symbol: "wEGLD",
        name: "Wrapped EGLD",
        decimals: 18,
        logoURI: ImgWEGLDIcon.src,
    },
    ASH: {
        identifier: "ASH-4ce444",
        chainId: ChainId.Devnet,
        symbol: "ASH",
        name: "Ashswap Token",
        decimals: 18,
        logoURI: ImgAshIcon.src,
    }
}

const TOKENS: IESDTInfo[] = [
    TOKENS_ALIAS.EGLD,
    TOKENS_ALIAS.wEGLD,
    TOKENS_ALIAS.ASH,
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
        identifier: "HSEGLD-8f2360",
        chainId: ChainId.Devnet,
        symbol: "HsEGLD",
        name: "Hatom sEGLD",
        decimals: 8,
        logoURI: IconHSEGLD.src,
    },
    {
        identifier: "LEGLD-3e7182",
        chainId: ChainId.Devnet,
        symbol: "LEGLD",
        name: "LiquidEGLD",
        decimals: 18,
        logoURI: IconLEGLD.src,
    },
    {
        identifier: "JWLASH-8bfcd2",
        chainId: ChainId.Devnet,
        symbol: "JWLASH",
        name: "JewelLockedASH",
        decimals: 18,
        logoURI: IconJWLASH.src,
    },
    {
        identifier: "JWLEGLD-761a4f",
        chainId: ChainId.Devnet,
        symbol: "JWLEGLD",
        name: "JewelLockedEGLD",
        decimals: 18,
        logoURI: IconJWLEGLD.src,
    },
    {
        identifier: "JWLHTM-935952",
        chainId: ChainId.Devnet,
        symbol: "JWLHTM",
        name: "JewelLockedHTM",
        decimals: 18,
        logoURI: IconJWLHTM.src,
    },
    {
        identifier: "SEGLD-80807d",
        chainId: ChainId.Devnet,
        symbol: "sEGLD",
        name: "Liquid Staked EGLD",
        decimals: 18,
        logoURI: IconSEGLD.src,
    },
];

const LP_TOKENS: IESDTInfo[] = [
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
        identifier: "ALP-90ac4b",
        chainId: ChainId.Devnet,
        symbol: "ALP-sEGLD",
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
        identifier: "ALP-9836b4",
        chainId: ChainId.Devnet,
        symbol: "ALP-HsEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-278df8",
        chainId: ChainId.Devnet,
        symbol: "ALP-LEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-9471de",
        chainId: ChainId.Devnet,
        symbol: "ALP-JWLASH",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-f881e3",
        chainId: ChainId.Devnet,
        symbol: "ALP-JWLEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-bddc86",
        chainId: ChainId.Devnet,
        symbol: "ALP-JWLHTM",
        name: "Ashswap LP",
        decimals: 18,
    },
    {
        identifier: "ALP-05cdde",
        chainId: ChainId.Devnet,
        symbol: "ALP-JWLEGLD",
        name: "Ashswap LP",
        decimals: 18,
    },
];

const TOKENS_MAP: Record<string, IESDTInfo> &
    typeof TOKENS_ALIAS = {
    ...Object.fromEntries([...TOKENS, ...LP_TOKENS].map((t) => [t.identifier, t])),
    ...TOKENS_ALIAS,
};
const TOKENS_BETA = {
    TOKENS,
    LP_TOKENS,
    TOKENS_MAP,
} as const;

export default TOKENS_BETA;