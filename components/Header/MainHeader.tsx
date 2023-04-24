import ImgAvatar from "assets/images/avatar.png";
import ICBambooShootSolid from "assets/svg/bamboo-shoot-solid.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICWallet from "assets/svg/wallet.svg";
import AddressMenu from "components/AddressMenu";
import Avatar from "components/Avatar";
import Image from "components/Image";
import { ENVIRONMENT } from "const/env";
import { useScreenSize } from "hooks/useScreenSize";
import dynamic from "next/dynamic";
import Link from "next/link";

const NavLazy = dynamic(import("components/Nav").then((m) => m.default));

function MainHeader() {
    const { isMobile } = useScreenSize();
    return (
        <header className="px-6 sm:px-12 py-5 relative z-20">
            <div className="flex justify-between items-center gap-4">
                <Link href="/">
                    <div className="cursor-pointer">
                        <span className="hidden lg:inline-block">
                            <Image
                                src="/logo.png"
                                alt="Ashswap logo"
                                height={54}
                                width={124}
                                quality={100}
                            />
                        </span>
                        <span className="inline-block lg:hidden">
                            <Image
                                src="/images/m-logo.png"
                                alt="Ashswap logo"
                                height={42}
                                width={28}
                                quality={100}
                            />
                        </span>
                    </div>
                </Link>
                <div className="hidden xl:block lg:ml-auto xl:ml-28">
                    {!isMobile && <NavLazy />}
                </div>
                <div className="flex items-center">
                    {ENVIRONMENT.ENABLE_ASHPOINT && (
                        <div className="mr-6 bg-ash-dark-600 relative">
                            <Link href="/ashpoint">
                                <div
                                    className={`h-10 flex items-center transition px-3 cursor-pointer`}
                                >
                                    <ICBambooShootSolid className="inline-block w-4 h-4 md:mr-2 transition-none text-stake-gray-500 fill-current" />
                                    <span className="inline-block font-bold text-xs text-white">
                                        Quest
                                    </span>
                                </div>
                            </Link>
                            <div className="w-2 h-2 rotate-45 bg-stake-green-500 absolute top-0 right-0 colored-drop-shadow-xs colored-drop-shadow-stake-green-500"></div>
                        </div>
                    )}
                    <AddressMenu
                        connectBtn={(connect) => {
                            return (
                                <button
                                    className="clip-corner-1 clip-corner-br bg-pink-600 text-white w-40 h-10 flex items-center justify-center"
                                    onClick={() => connect()}
                                >
                                    <ICWallet className="h-5 w-5 mr-2" />
                                    <span className="text-xs font-bold">
                                        Connect wallet
                                    </span>
                                </button>
                            );
                        }}
                        dropdownBtn={(address, setMDrawer) => {
                            return (
                                <button
                                    className="w-40 h-10 bg-ash-dark-600 hover:bg-ash-dark-500 flex items-center justify-center text-white font-bold"
                                    onClick={() => isMobile && setMDrawer(true)}
                                >
                                    <Avatar
                                        src={ImgAvatar}
                                        alt="avatar"
                                        className="w-4 h-4"
                                    />
                                    <span className="ml-2 mr-5">
                                        {address.slice(0, 4) +
                                            "..." +
                                            address.slice(address.length - 4)}
                                    </span>
                                    <ICChevronDown />
                                </button>
                            );
                        }}
                    />
                </div>
            </div>
            <div className="mt-4 hidden sm:flex xl:hidden justify-center">
                {!isMobile && <NavLazy />}
            </div>
        </header>
    );
}

export default MainHeader;
