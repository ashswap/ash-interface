import ImgAvatar from "assets/images/avatar.png";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICWallet from "assets/svg/wallet.svg";
import AddressMenu from "components/AddressMenu";
import Nav from "components/Nav";
import { useScreenSize } from "hooks/useScreenSize";
import Image from "next/image";
import Link from "next/link";

const AppBar = () => {
    const { isMobile } = useScreenSize();
    return (
        <>
            <div className="flex justify-between items-center px-6 sm:px-12 py-5 relative z-20">
                <Link href="/" passHref>
                    <div className="cursor-pointer">
                        <span className="hidden md:inline-block">
                            <Image
                                src="/logo.png"
                                alt="Ashswap logo"
                                height={54}
                                width={124}
                                quality={100}
                            />
                        </span>
                        <span className="inline-block md:hidden">
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
                <div className="hidden sm:block">
                    <Nav />
                </div>
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
                                <Image
                                    src={ImgAvatar}
                                    alt="avatar"
                                    width={16}
                                    height={16}
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
            <div className="block sm:hidden fixed z-20 bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#757391] bg-opacity-10 backdrop-filter backdrop-blur-[25px] p-1">
                    <Nav />
                </div>
            </div>
        </>
    );
};

export default AppBar;
