import AddressMenu from "components/AddressMenu";
import Nav from "components/Nav";
import Image from "next/image";
import Link from "next/link";

const AppBar = () => {
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
                <AddressMenu />
            </div>
            <div className="block sm:hidden fixed z-10 bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#757391] bg-opacity-10 backdrop-filter backdrop-blur-[25px] p-1">
                    <Nav />
                </div>
            </div>
        </>
    );
};

export default AppBar;
