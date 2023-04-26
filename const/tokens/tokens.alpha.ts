import IconAEGLD from "assets/images/aegld-icon.png";
import ImgAshIcon from "assets/images/ash-icon.png";
import IconBUSD from "assets/images/busd-icon.png";
import ImgEgldIcon from "assets/images/egld-icon.png";
import IconSEGLD from "assets/images/segld-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";
import IconWEGLD from "assets/images/wegld-icon-boy.png";
import ImgWEGLDIcon from "assets/images/wegld-icon.png";
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
        identifier: "ASH-84eab0",
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
];
const LP_TOKENS: IESDTInfo[] = [
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
    },
];
const TOKENS_MAP: Record<string, IESDTInfo> &
    typeof TOKENS_ALIAS = {
    ...Object.fromEntries([...TOKENS, ...LP_TOKENS].map((t) => [t.identifier, t])),
    ...TOKENS_ALIAS,
};
const TOKENS_ALPHA = {
    TOKENS,
    LP_TOKENS,
    TOKENS_MAP,
} as const;

export default TOKENS_ALPHA;
