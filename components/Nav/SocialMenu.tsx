import discordImage from "assets/images/discord.png";
import gmailImage from "assets/images/gmail.png";
import mediumImage from "assets/images/medium.png";
import redditImage from "assets/images/reddit.png";
import telegramImage from "assets/images/telegram.png";
import twitterImage from "assets/images/twitter.png";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICNewTabRound from "assets/svg/new-tab-round.svg";
import ICSocial from "assets/svg/social.svg";
import BaseModal from "components/BaseModal";
import BaseTooltip from "components/BaseTooltip";
import Image from "components/Image";
import { useScreenSize } from "hooks/useScreenSize";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./Nav.module.css";
const SOCIALS = [
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
const LEGAL_LINKS = [
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
            "text-ash-cyan-500 colored-drop-shadow-xs colored-drop-shadow-ash-cyan-500",
    },
    {
        name: "Disclaimer",
        url: "https://ashswap.io/disclaimer",
        iconClassName:
            "text-ash-purple-500 colored-drop-shadow-xs colored-drop-shadow-ash-purple-500",
    },
];
const iconClassName = "text";
function HeadlessLink(
    props: React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
    >
) {
    let { href, children, ...rest } = props;
    return href ? (
        <Link href={href}>
            <a {...rest}>{children}</a>
        </Link>
    ) : (
        <>{children}</>
    );
}
const MenuContent = () => {
    return (
        <>
            <div className="font-bold text-lg text-white mb-6">
                Legal Documents
            </div>
            <div className="space-y-2 mb-12">
                {LEGAL_LINKS.map(({ url, name, iconClassName }) => {
                    return (
                        <a
                            key={name}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="block"
                        >
                            <div className="py-2.5 px-3 bg-ash-dark-400 hover:bg-stake-dark-400 flex items-center justify-between space-x-1 text-ash-gray-500 transition-all duration-300">
                                <div className="flex items-center space-x-4">
                                    <svg
                                        width="18"
                                        height="9"
                                        viewBox="0 0 18 9"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={iconClassName}
                                    >
                                        <path
                                            d="M17.5 5.88233L12.0369 0.000385219L6.57376 0.000385154L1.01366e-07 2.26795e-05L7.39617 8.5L17.5 8.50037L17.5 5.88233Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <div className="font-medium text-sm truncate">
                                        {name}
                                    </div>
                                </div>
                                <ICNewTabRound className="w-3.5 h-auto" />
                            </div>
                        </a>
                    );
                })}
            </div>
            <div className="mb-4 font-bold text-xs text-white">
                AshSwap in socials
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(0,20px))] gap-2">
                {SOCIALS.map(({ image, name, url }) => {
                    return (
                        <a
                            key={name}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:scale-125 transition-all duration-300"
                        >
                            <Image
                                src={image}
                                alt={name}
                                width={20}
                                height={20}
                            />
                        </a>
                    );
                })}
            </div>
        </>
    );
};
function SocialMenu() {
    const [mIsOpen, setMIsOpen] = useState(false);
    const [openTooltip, setOpenTooltip] = useState(false);
    const { isMobile } = useScreenSize();
    if (!isMobile)
        return (
            <div>
                <BaseTooltip
                    placement="bottom"
                    open={openTooltip}
                    onOpenChange={(val) => setOpenTooltip(val)}
                    content={
                        <div className="bg-ash-dark-600 p-8 min-w-[22.5rem]">
                            <MenuContent />
                        </div>
                    }
                >
                    <button className={`${styles.btn} outline-none`}>
                        <ICSocial className="inline-block w-4 h-4 md:mr-2 transition-none" />
                        <div className="flex items-center">
                            <span className="truncate">More</span>
                            <ICChevronDown className="inline w-2 ml-1 transition-none" />
                        </div>
                    </button>
                </BaseTooltip>
            </div>
        );
    return (
        <div>
            <div
                role="button"
                className={`${styles.btn} sm:hidden outline-none ${
                    mIsOpen && styles.active
                }`}
                onClick={() => setMIsOpen(true)}
            >
                <ICSocial className="inline-block w-4 h-4 md:mr-2" />
                <div className="flex items-center">
                    <span className="truncate">Social</span>
                    <ICChevronDown className="inline w-2 ml-1 transition-none" />
                </div>
            </div>
            <BaseModal
                isOpen={mIsOpen}
                onRequestClose={() => setMIsOpen(false)}
                type="drawer_btt"
                className="clip-corner-4 clip-corner-tl bg-ash-dark-600 p-4 text-white max-h-screen flex flex-col"
            >
                <div className="flex justify-end mb-3.5">
                    <BaseModal.CloseBtn />
                </div>
                <div className="grow overflow-auto">
                    <div className="px-6 pb-[3.75rem]">
                        <MenuContent />
                    </div>
                </div>
            </BaseModal>
        </div>
    );
}

export default SocialMenu;
