import ImgXexchange from "assets/images/protocols/xexchange.png";
import ImgAshswap from "assets/images/protocols/ashswap.png";
import ImgOnedex from "assets/images/protocols/onedex.png";
import ImgJexchange from "assets/images/protocols/jexchange.png";
export const DEX_PROTOCOLS_MAP: Record<
    string,
    { name: string; url?: string; logoUrl?: string }
> = {
    xexchange: {
        name: "xExchange",
        logoUrl: ImgXexchange.src,
    },
    ["ashswap-poolv1"]: {
        name: "Ashswap Stable Pool",
        logoUrl: ImgAshswap.src,
    },
    ["ashswap-poolv2"]: {
        name: "Ashswap Crypto Pool",
        logoUrl: ImgAshswap.src,
    },
    onedex: {
        name: "OneDex",
        logoUrl: ImgOnedex.src,
    },
    jexchange: {
        name: "Jexchange",
        logoUrl: ImgJexchange.src,
    },
};
