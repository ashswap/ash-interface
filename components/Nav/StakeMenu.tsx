import { Menu, Transition } from "@headlessui/react";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICStake from "assets/svg/stake.svg";
import BaseModal from "components/BaseModal";
import { TAILWIND_BREAKPOINT } from "const/mediaQueries";
import useMediaQuery from "hooks/useMediaQuery";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import styles from "./Nav.module.css";
const SOCIALS = [
    {
        name: "Liquidity Stake",
        url: "/stake/farms",
    },
    { name: "Governance Stake", url: "/stake/gov" },
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
function StakeMenu() {
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
                            <ICStake className="inline-block w-4 h-4 md:mr-2 transition-none" />
                            <div className="flex items-center">
                                <span className="truncate">Stake</span>
                                <ICChevronDown className="inline w-2 ml-1 transition-none" />
                            </div>
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            show={open}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute left-0 top-[100%] mt-2 bg-ash-dark-700 py-6 w-max min-w-[10.5rem] outline-none">
                                {SOCIALS.map(({ url, name }) => {
                                    return (
                                        <Menu.Item key={name}>
                                            {({ active }) => (
                                                <HeadlessLink
                                                    href={url}
                                                    className={`py-3 px-8 flex items-center overflow-hidden text-white hover:text-white transition-all font-bold text-xs ${
                                                        active
                                                            ? "bg-ash-dark-500"
                                                            : "hover:bg-ash-dark-500"
                                                    }`}
                                                >
                                                    <span className="capitalize">
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
                        <ICStake className="inline-block w-4 h-4 md:mr-2" />
                        <div className="flex items-center">
                            <span className="truncate">Stake</span>
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
                        <div className="flex-grow overflow-auto">
                            <div className="px-6 pb-[3.75rem]">
                                <div className="mb-9 text-2xl font-bold">
                                    Stake
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {SOCIALS.map(({ name, url }) => {
                                        return (
                                            <HeadlessLink
                                                key={name}
                                                href={url}
                                                onClick={() =>
                                                    setMIsOpen(false)
                                                }
                                            >
                                                <div className="bg-ash-dark-400 px-6 h-12 flex items-center text-xs font-bold text-white">
                                                    <span className="capitalize truncate">
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

export default StakeMenu;
