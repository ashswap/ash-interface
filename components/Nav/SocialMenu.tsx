import { Menu, Transition } from "@headlessui/react";
import BaseModal from "components/BaseModal";
import { TAILWIND_BREAKPOINT } from "const/mediaQueries";
import useMediaQuery from "hooks/useMediaQuery";
import Image from "components/Image";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import discordImage from "../../assets/images/discord.png";
import gmailImage from "../../assets/images/gmail.png";
import mediumImage from "../../assets/images/medium.png";
import redditImage from "../../assets/images/reddit.png";
import telegramImage from "../../assets/images/telegram.png";
import twitterImage from "../../assets/images/twitter.png";
import ICChervonDown from "../../assets/svg/chevron-down.svg";
import ICSocial from "../../assets/svg/social.svg";
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
function SocialMenu() {
    const [mIsOpen, setMIsOpen] = useState(false);
    const isSMScreen = useMediaQuery(
        `(max-width: ${TAILWIND_BREAKPOINT.SM}px)`
    );
    return (
        <div>
            <Menu
                as="div"
                className="hidden sm:flex relative text-left items-center"
            >
                {({ open }) => (
                    <>
                        <Menu.Button
                            className={`${styles.btn} outline-none ${
                                open && styles.active
                            }`}
                        >
                            <ICSocial className="inline-block w-4 h-4 md:mr-2 transition-none" />
                            <div className="flex items-center">
                                <span className="truncate">Social</span>
                                <ICChervonDown className="inline w-2 ml-1 transition-none" />
                            </div>
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            show={open}
                            enter="transition ease-out duration-100"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute left-0 top-[100%] mt-2 bg-ash-dark-700 py-6 w-[10.5rem] outline-none">
                                {SOCIALS.map(({ url, image, name }) => {
                                    return (
                                        <Menu.Item key={name}>
                                            {({ active }) => (
                                                <HeadlessLink
                                                    href={url}
                                                    target="_blank"
                                                    className={`py-3 px-8 flex items-center overflow-hidden text-white hover:text-white transition-all font-bold text-xs ${
                                                        active
                                                            ? "bg-ash-dark-500"
                                                            : "hover:bg-ash-dark-500"
                                                    }`}
                                                >
                                                    <span className="shrink-0 rounded">
                                                        <Image
                                                            src={image}
                                                            alt={name}
                                                            width={20}
                                                            height={20}
                                                        />
                                                    </span>
                                                    <span className="capitalize ml-3.5">
                                                        {name}
                                                    </span>
                                                </HeadlessLink>
                                            )}
                                        </Menu.Item>
                                    );
                                })}
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
            {isSMScreen && (
                <>
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
                            <ICChervonDown className="inline w-2 ml-1 transition-none" />
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
                                <div className="mb-9 text-2xl font-bold">
                                    Social
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {SOCIALS.map(({ image, name, url }) => {
                                        return (
                                            <HeadlessLink
                                                key={name}
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <div className="bg-ash-dark-400 px-6 h-12 flex items-center text-xs font-bold text-white">
                                                    <span className="shrink-0 rounded">
                                                        <Image
                                                            src={image}
                                                            alt={name}
                                                            width={20}
                                                            height={20}
                                                        />
                                                    </span>
                                                    <span className="capitalize ml-3.5 truncate">
                                                        {name}
                                                    </span>
                                                </div>
                                            </HeadlessLink>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </BaseModal>
                </>
            )}
        </div>
    );
}

export default SocialMenu;
