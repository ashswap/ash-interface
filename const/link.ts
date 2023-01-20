import discordImage from "assets/images/discord.png";
import gmailImage from "assets/images/gmail.png";
import mediumImage from "assets/images/medium.png";
import redditImage from "assets/images/reddit.png";
import telegramImage from "assets/images/telegram.png";
import twitterImage from "assets/images/twitter.png";
export const SOCIALS = [
    {
        name: "Discord",
        url: "https://discord.gg/apmhYCPDbW",
        image: discordImage,
    },
    { name: "Telegram", url: "https://t.me/ash_swap", image: telegramImage },
    {
        name: "Twitter",
        url: "https://twitter.com/@ash_swap",
        image: twitterImage,
    },
    { name: "Medium", url: "https://medium.com/@ashswap", image: mediumImage },
    {
        name: "Reddit",
        url: "https://www.reddit.com/r/AshSwap",
        image: redditImage,
    },
    {
        name: "Gmail",
        url:
            typeof window === "undefined"
                ? "mailto:helloATashswapDOTio?subject=AshSwap Contact&cc=helloATbicarusDOTio"
                : "mailto:hello@ashswap.io?subject=AshSwap Contact&cc=hello@bicarus.io",
        image: gmailImage,
    },
];
export const LEGAL_LINKS = [
    {
        name: "Terms of use",
        url: "https://ashswap.io/terms",
        iconClassName:
            "text-pink-600 colored-drop-shadow-xs colored-drop-shadow-pink-600",
    },
    {
        name: "Privacy Policy",
        url: "https://ashswap.io/privacy/policy",
        iconClassName:
            "text-ash-cyan-500 colored-drop-shadow-xs colored-drop-shadow-current",
    },
    {
        name: "Disclaimer",
        url: "https://ashswap.io/disclaimer",
        iconClassName:
            "text-ash-purple-500 colored-drop-shadow-xs colored-drop-shadow-current",
    },
];