import ICChart from "assets/svg/chart.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";
import ICFarm from "assets/svg/farm.svg";
import ICNewTabRound from "assets/svg/new-tab-round.svg";
import ICPool from "assets/svg/pool.svg";
import ICSocial from "assets/svg/social.svg";
import ICStake from "assets/svg/stake.svg";
import ICSwap from "assets/svg/swap.svg";
import BaseModal from "components/BaseModal";
import Image from "components/Image";
import { LEGAL_LINKS, SOCIALS } from "const/link";
import Link from "next/link";
import { useState } from "react";
import LegalLinkItem from "./LegalLinkItem";
import NavLink from "./NavLink";
function NavMobile() {
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    return (
        <div className="block sm:hidden fixed z-20 bottom-0 inset-x-0 xs:p-5">
            <div className="bg-[#757391] bg-opacity-10 backdrop-blur-[25px] p-2">
                <nav className="grid grid-cols-5">
                    <NavLink href="/swap">
                        <ICSwap className="w-4 h-auto" />
                        <span>Swap</span>
                    </NavLink>
                    <NavLink href="/pool">
                        <ICPool className="w-4 h-auto" />
                        <span>Pool</span>
                    </NavLink>
                    <NavLink href="/stake/farms">
                        <ICFarm className="w-4 h-auto" />
                        <span>Farm</span>
                    </NavLink>
                    <NavLink href="/stake/gov" className="overflow-hidden">
                        <ICStake className="w-4 h-auto" />
                        <span className="w-full inline-block truncate">Governance</span>
                    </NavLink>
                    <NavLink href="#" onClick={() => setIsOpenDrawer(true)}>
                        <ICSocial className="-mt-0.5 w-4 h-auto" />
                        <span className="inline-flex items-center gap-1 md:gap-2">
                            <span>More</span>
                            <ICChevronUp className="md:-mt-0.5 w-2 md:w-3 h-auto" />
                        </span>
                    </NavLink>
                </nav>
            </div>
            <BaseModal
                isOpen={isOpenDrawer}
                onRequestClose={() => setIsOpenDrawer(false)}
                type="drawer_btt"
            >
                <div className="clip-corner-4 clip-corner-tl p-4 bg-ash-dark-600 flex flex-col max-h-screen">
                    <div className="mb-4 flex justify-end">
                        <BaseModal.CloseBtn />
                    </div>
                    <div className="grow overflow-auto px-6 py-2 flex flex-col gap-12">
                        <div>
                            <div className="mb-6 font-bold text-lg text-white">
                                Analytics
                            </div>
                            <Link
                                href="/info"
                                target="_blank"
                                rel="noreferrer"
                                className="block"
                            >
                                <div className="py-2.5 px-3 bg-ash-dark-400 hover:bg-stake-dark-400 flex items-center justify-between space-x-1 text-stake-gray-500 transition-all duration-300">
                                    <div className="flex items-center space-x-4 overflow-hidden">
                                        <ICChart />
                                        <div className="font-medium text-sm truncate">
                                            View analytics
                                        </div>
                                    </div>
                                    <ICNewTabRound className="w-3.5 h-auto shrink-0" />
                                </div>
                            </Link>
                        </div>
                        <div>
                            <div className="mb-6 font-bold text-lg text-white">
                                Legal Documents
                            </div>
                            <div className="space-y-2">
                                {LEGAL_LINKS.map((linkProps) => {
                                    return (
                                        <LegalLinkItem
                                            key={linkProps.name}
                                            {...linkProps}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <div className="mb-6 font-bold text-lg text-white">
                                Ashswap on socials
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {SOCIALS.map((linkProps) => {
                                    return (
                                        <Link
                                            key={linkProps.url}
                                            href={linkProps.url}
                                            target="_blank"
                                            className="h-12 py-2.5 px-3 bg-ash-dark-400 hover:bg-stake-dark-400 flex items-center gap-x-4 transition-all duration-300"
                                        >
                                            <Image
                                                src={linkProps.image}
                                                alt={linkProps.name}
                                                className="w-4 h-auto"
                                            />
                                            <span className="font-bold text-xs text-stake-gray-500">
                                                {linkProps.name}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <div className="mb-6 font-bold text-lg text-white">
                                Others
                            </div>
                            <div className="flex flex-col gap-2">
                            <Link
                                href="https://event.ashswap.io"
                                target="_blank"
                                rel="noreferrer"
                                className="block"
                            >
                                <div className="py-2.5 px-3 bg-ash-dark-400 hover:bg-stake-dark-400 flex items-center justify-between space-x-1 text-stake-gray-500 transition-all duration-300">
                                    <div className="flex items-center space-x-4 overflow-hidden">
                                        <div className="font-medium text-sm truncate">
                                            Event
                                        </div>
                                    </div>
                                    <ICNewTabRound className="w-3.5 h-auto shrink-0" />
                                </div>
                            </Link>
                            <Link
                                href="https://forms.gle/VfEEfzTG3LnJPPxC9"
                                target="_blank"
                                rel="noreferrer"
                                className="block"
                            >
                                <div className="py-2.5 px-3 bg-ash-dark-400 hover:bg-stake-dark-400 flex items-center justify-between space-x-1 text-stake-gray-500 transition-all duration-300">
                                    <div className="flex items-center space-x-4 overflow-hidden">
                                        <div className="font-medium text-sm truncate">
                                            Support ticket
                                        </div>
                                    </div>
                                    <ICNewTabRound className="w-3.5 h-auto shrink-0" />
                                </div>
                            </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseModal>
        </div>
    );
}

export default NavMobile;
