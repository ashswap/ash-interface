import ImgAvatar from "assets/images/avatar.png";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICDrop from "assets/svg/drop.svg";
import ICHomeTrendUp from "assets/svg/home-trend-up.svg";
import ICMoon from "assets/svg/moon.svg";
import ICRepeat from "assets/svg/repeat-music.svg";
import ICSearch from "assets/svg/search.svg";
import ICStar from "assets/svg/star.svg";
import ICSun from "assets/svg/sun.svg";
import ICToken from "assets/svg/token.svg";
import ICWallet from "assets/svg/wallet.svg";
import Input from "components/Input";
import { useScreenSize } from "hooks/useScreenSize";
import Image from "next/image";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import ImgLogo from "public/images/m-logo.png";
import React, { useCallback, useState } from "react";
type NavLinkProps = {
    active: boolean;
    name: string;
    Icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
} & LinkProps;
const SwitchThemeBtn = () => {
    const [dark, setDark] = useState(true);
    return (
        <button
            role="switch"
            aria-checked={dark}
            className="relative w-20 flex items-center mt-[1.125rem] mb-3"
            onClick={() => setDark((val) => !val)}
        >
            <svg
                // width="80"
                // height="27"
                viewBox="0 0 80 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M13 27H67L80 13.4415L67 0H13L0 13.4415L13 27Z"
                    fill="#7B61FF"
                    fillOpacity="0.2"
                />
            </svg>
            <div className="absolute w-6 h-6 left-3 flex items-center justify-center">
                <div
                    className="absolute w-full h-full rotate-45 bg-ash-purple-500"
                    style={{
                        boxShadow: "0px 4px 20px #7B61FF",
                        opacity: dark ? "1" : "0",
                    }}
                ></div>
                <ICMoon
                    className={`relative w-3.5 h-3.5 ${
                        dark ? "text-white" : "text-ash-purple-500"
                    }`}
                />
            </div>
            <div className="absolute w-6 h-6 right-3 flex items-center justify-center">
                <div
                    className="absolute w-full h-full rotate-45 bg-ash-purple-500"
                    style={{
                        boxShadow: "0px 4px 20px #7B61FF",
                        opacity: !dark ? "1" : "0",
                    }}
                ></div>
                <ICSun
                    className={`relative w-3.5 h-3.5 ${
                        !dark ? "text-white" : "text-ash-purple-500"
                    }`}
                />
            </div>
        </button>
    );
};
const NavLink = ({ active, name, Icon, ...linkProps }: NavLinkProps) => {
    return (
        <Link {...linkProps}>
            <a>
                <div className={`flex relative py-3 font-bold text-sm ${active ? 'text-white' : 'text-ash-gray-500'}`}>
                    <Icon
                        className={`inline w-5 h-5 mr-4 ${
                            active ? "text-pink-600" : ""
                        }`}
                    />
                    <span>{name}</span>
                    <span
                        className={`w-0.5 h-5 absolute right-0 ${
                            active ? "bg-pink-600" : "bg-transparent"
                        }`}
                    ></span>
                </div>
            </a>
        </Link>
    );
};
const MNavLink = ({ active, name, Icon, ...linkProps }: NavLinkProps) => {
    return (
        <li className={`flex-1`}>
            <Link {...linkProps}>
                <a>
                    <div
                        className={`h-[4.5rem] flex flex-col items-center justify-center text-center
                                    ${
                                        active
                                            ? "text-white"
                                            : "text-ash-gray-500"
                                    }`}
                    >
                        <Icon
                            className={`w-5 h-5 mb-1 ${
                                active ? "text-pink-600" : ""
                            }`}
                        />
                        <div className="font-bold text-2xs">{name}</div>
                    </div>
                </a>
            </Link>
        </li>
    );
};
function InfoLayout({ children }: any) {
    const screenSizes = useScreenSize();
    const router = useRouter();

    const isActive = useCallback(
        (path: string, exact = false) =>
            exact ? router.pathname === path : router.route.startsWith(path),
        [router]
    );
    // desktop
    if (!screenSizes.msm) {
        return (
            <div className="flex overflow-x-hidden">
                <aside className="flex-shrink-0 fixed top-0 left-0 h-screen overflow-hidden w-52 md:w-60 bg-ash-dark-600 pl-4 md:pl-12 py-9 flex flex-col space-y-5">
                    <div className="w-14 h-14 relative flex-shrink-0">
                        <Image
                            src={ImgLogo}
                            alt="ashswap logo"
                            layout="fill"
                            objectFit="contain"
                        ></Image>
                    </div>
                    <div className="flex-grow overflow-auto">
                        <ul>
                            <li>
                                <NavLink
                                    href={{ pathname: "/info" }}
                                    name="Overview"
                                    Icon={ICHomeTrendUp}
                                    active={isActive("/info", true)}
                                />
                            </li>
                            <li>
                                <NavLink
                                    href="/info/tokens"
                                    name="Tokens"
                                    Icon={ICToken}
                                    active={isActive("/info/tokens", true)}
                                />
                            </li>
                            <li>
                                <NavLink
                                    href="/info/pools"
                                    name="Pools"
                                    Icon={ICDrop}
                                    active={isActive("/info/pools", true)}
                                />
                            </li>
                            <li>
                                <NavLink
                                    href="/info/wallet"
                                    name="Wallets"
                                    Icon={ICWallet}
                                    active={isActive("/info/wallet", true)}
                                />
                            </li>
                            <li>
                                <NavLink
                                    href="/info/transactions"
                                    name="Trans"
                                    Icon={ICRepeat}
                                    active={isActive(
                                        "/info/transactions",
                                        true
                                    )}
                                />
                            </li>
                        </ul>
                    </div>
                    <div className="flex-shrink-0 flex flex-col space-y-2">
                        <div className="text-ash-gray-500 text-xs mb-8">
                            <span className="inline-block rounded-full bg-ash-green-500 w-2 h-2 mr-2"></span>
                            <span>Updated 4 mins ago</span>
                        </div>
                        <div className="text-ash-gray-500 text-xs">
                            Trans count (24H): 77,312
                        </div>
                        <div className="text-ash-gray-500 text-xs">
                            Fees (24H): $1,52M
                        </div>
                        <div className="text-ash-gray-500 text-xs">
                            Wallet count (24H): 21
                        </div>
                    </div>
                </aside>
                <div className="flex-grow px-4 lg:px-9 lg:py-6 relative overflow-x-hidden ml-52 md:ml-60 mr-32">
                    <div className="fixed top-6 right-[10.25rem] z-20">
                        <Input
                            backgroundClassName="bg-ash-dark-700/70 h-12 px-5"
                            className="text-white text-2xs"
                            suffix={<ICSearch />}
                            placeholder="Search token, pair"
                        />
                    </div>
                    {children}
                </div>
                <aside className="flex-shrink-0 fixed top-0 right-0 h-screen overflow-auto w-32 bg-ash-dark-600 px-4 py-6 text-white">
                    <div className="bg-ash-dark-400 p-2 flex flex-col items-center mb-4">
                        <Image
                            src={ImgAvatar}
                            alt="avatar"
                            width={32}
                            height={32}
                        />
                        <div className="mt-2 flex items-center justify-between font-bold text-xs w-full">
                            <span>4a51...PHFA</span>
                            <ICChevronDown className="inline w-2 h-2" />
                        </div>
                        <SwitchThemeBtn />
                    </div>
                    <button className="bg-ash-dark-400 h-10 w-full flex items-center justify-center">
                        <ICStar className="inline text-[#FFC10D] w-4 h-4 mr-3" />
                        <span className="text-xs font-bold">Saved</span>
                    </button>
                </aside>
            </div>
        );
    }
    // mobile
    return (
        <div>
            <header className="sticky top-0 left-0 right-0 z-20 w-full h-[4.5rem] flex items-center justify-between px-6 text-white bg-ash-dark-400">
                <div className="mr-5 flex-shrink-0">
                    <Image
                        src={ImgLogo}
                        alt="ash logo"
                        width={28}
                        height={42}
                    />
                </div>
                <div className="flex-grow flex items-center space-x-1 overflow-hidden">
                    <Input
                        backgroundClassName="bg-ash-dark-700/70"
                        className="text-white text-2xs h-10 px-4 flex-grow overflow-hidden"
                        suffix={<ICSearch />}
                        placeholder="Search token, pair"
                        size={5}
                    />
                    <button className="bg-ash-dark-600 h-10 w-24 flex items-center justify-center flex-shrink-0">
                        <ICStar className="inline text-[#FFC10D] w-4 h-4 mr-3" />
                        <span className="text-2xs font-bold">Saved</span>
                    </button>
                    <div className="flex items-center bg-ash-dark-600 h-10 px-3 flex-shrink-0">
                        <Image
                            src={ImgAvatar}
                            alt="account avatar"
                            width={14}
                            height={14}
                        />
                        <ICChevronDown className="inline w-2 h-2 ml-2.5" />
                    </div>
                </div>
            </header>
            <div className="pb-[4.5rem]">{children}</div>
            <nav className="fixed bottom-0 left-0 right-0 w-full text-white bg-black/40 backdrop-filter backdrop-blur-xl">
                <ul className="flex">
                    <MNavLink
                        href={{ pathname: "/info" }}
                        name="Overview"
                        Icon={ICHomeTrendUp}
                        active={isActive("/info", true)}
                    />
                    <MNavLink
                        href="/info/tokens"
                        name="Tokens"
                        Icon={ICToken}
                        active={isActive("/info/tokens", true)}
                    />
                    <MNavLink
                        href="/info/pools"
                        name="Pools"
                        Icon={ICDrop}
                        active={isActive("/info/pools", true)}
                    />
                    <MNavLink
                        href="/info/wallet"
                        name="Wallets"
                        Icon={ICWallet}
                        active={isActive("/info/wallet", true)}
                    />
                    <MNavLink
                        href="/info/transactions"
                        name="Trans"
                        Icon={ICRepeat}
                        active={isActive("/info/transactions", true)}
                    />
                </ul>
            </nav>
        </div>
    );
}

export default InfoLayout;
