import { transactionServices } from "@elrondnetwork/dapp-core";
import ImgLPGem from "assets/images/lp-gem.png";
import ImgMintGem from "assets/images/mint-gem.png";
import ImgVoteGem from "assets/images/vote-gem.png";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICStakeGov from "assets/svg/stake-gov.svg";
import ICStakeLP from "assets/svg/stake-lp.svg";
import ICStakeMintAoc from "assets/svg/stake-mint-aoc.svg";
import ICStake from "assets/svg/stake.svg";
import { addLPSessionIdAtom } from "atoms/addLiquidity";
import BaseModal from "components/BaseModal";
import BaseTooltip from "components/BaseTooltip";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { useOnboarding } from "hooks/useOnboarding";
import { useScreenSize } from "hooks/useScreenSize";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
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
    const { isMobile } = useScreenSize();
    const [openTooltip, setOpenTooltip] = useState(false);
    const router = useRouter();
    const addLPSessionId = useRecoilValue(addLPSessionIdAtom);
    const { isSuccessful } = transactionServices.useTrackTransactionStatus({
        transactionId: addLPSessionId,
    });
    const [onboaringFarmFromAddedLp, setOnboardedFarmFromAddedLp] =
        useOnboarding("pool_farm_from_added_lp");

    useEffect(() => {
        setOpenTooltip(false);
    }, [router.route]);
    if (!isMobile)
        return (
            <div>
                <BaseTooltip
                    placement="bottom"
                    open={
                        openTooltip &&
                        (!isSuccessful || !onboaringFarmFromAddedLp)
                    }
                    onOpenChange={(val) => setOpenTooltip(val)}
                    content={
                        <div className="grid grid-cols-3 w-screen max-w-5xl gap-1">
                            <Link href="/stake/farms">
                                <a>
                                    <div
                                        className={`transition-all bg-stake-dark-400 hover:bg-[#454765] ${styles.stakeMenuItem} p-4 md:p-8 h-full`}
                                    >
                                        <div className="relative">
                                            <ICStakeLP className="text-ash-gray-600/30 h-18 absolute top-0 right-0" />
                                            <div className="mb-12">
                                                <div className="w-12 mb-2">
                                                    <Image
                                                        src={ImgLPGem}
                                                        alt="farming icon"
                                                        layout="responsive"
                                                    />
                                                </div>

                                                <div className="text-ash-cyan-500 text-sm font-bold">
                                                    Liquidity Stake
                                                </div>
                                            </div>
                                            <div className="text-white bg-ash-dark-400/30 p-6 text-sm font-bold">
                                                Stake LP-Tokens to farm ASH
                                                everyday
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                            <Link href="/stake/gov">
                                <a>
                                    <div
                                        className={`transition-all bg-stake-dark-400 hover:bg-[#454765] ${styles.stakeMenuItem} p-4 md:p-8 h-full`}
                                    >
                                        <div className="relative">
                                            <ICStakeGov className="text-ash-gray-600/30 h-18 absolute top-0 right-0" />
                                            <div className="mb-12">
                                                <div className="w-12 mb-2">
                                                    <Image
                                                        src={ImgVoteGem}
                                                        alt="vote-escrow icon"
                                                        layout="responsive"
                                                    />
                                                </div>

                                                <div className="text-pink-600 text-sm font-bold">
                                                    Governance Stake
                                                </div>
                                            </div>
                                            <div className="bg-ash-dark-400/30 p-6">
                                                <div className="text-white text-sm font-bold mb-4">
                                                    Stake ASH to get veASH, for:
                                                </div>
                                                <div className="flex flex-col space-y-2 text-stake-gray-500 text-xs font-bold">
                                                    <div className="flex">
                                                        <svg
                                                            width="12"
                                                            height="12"
                                                            viewBox="0 0 12 12"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2"
                                                        >
                                                            <rect
                                                                width="12"
                                                                height="12"
                                                                fill="#B7B7D7"
                                                                fillOpacity="0.1"
                                                            />
                                                            <path
                                                                d="M0.0146484 6.48232L1.11491 4.99959L2.02328 4.99959L8.52855 4.99959L7.92254 6.97656L0.0146484 6.97656L0.0146484 6.48232Z"
                                                                fill="#B7B7D7"
                                                            />
                                                            <path
                                                                d="M7.42828 6.97615L8.02678 4.99918L8.90329 4.99918L11.9807 4.99918L8.7956 7.76694L6.0498 8.95312L7.42828 6.97615Z"
                                                                fill="#B7B7D7"
                                                            />
                                                        </svg>
                                                        <div>
                                                            Earning transaction
                                                            fees
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <svg
                                                            width="12"
                                                            height="12"
                                                            viewBox="0 0 12 12"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2"
                                                        >
                                                            <rect
                                                                width="12"
                                                                height="12"
                                                                fill="#B7B7D7"
                                                                fillOpacity="0.1"
                                                            />
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M8.92897 3.73302L3.40835 4.25714L1 3.73285L3.93901 2.00553L11.0001 0.902344L8.92897 3.73302ZM3.68798 10.8945L1.58366 10.9086L1.12904 10.576L4.51197 6.12445L7.73616 5.53372L4.29932 10.059L3.68798 10.8945Z"
                                                                fill="#B7B7D7"
                                                            />
                                                        </svg>

                                                        <div>Yield boost</div>
                                                    </div>
                                                    <div className="flex">
                                                        <svg
                                                            width="12"
                                                            height="12"
                                                            viewBox="0 0 12 12"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2"
                                                        >
                                                            <rect
                                                                width="12"
                                                                height="12"
                                                                fill="#B7B7D7"
                                                                fillOpacity="0.1"
                                                            />
                                                            <path
                                                                d="M4.50007 6.44011L6.8148 6.42455L7.48727 5.50546L11.2677 0.527758L7.72117 1.17756L4 6.07422L4.50007 6.44011Z"
                                                                fill="#B7B7D7"
                                                            />
                                                        </svg>

                                                        <div>
                                                            Vote{" "}
                                                            <span className="text-ash-cyan-500">
                                                                Liquidity Stake
                                                            </span>{" "}
                                                            weight
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <svg
                                                            width="12"
                                                            height="12"
                                                            viewBox="0 0 12 12"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2"
                                                        >
                                                            <rect
                                                                width="12"
                                                                height="12"
                                                                fill="#B7B7D7"
                                                                fillOpacity="0.1"
                                                            />
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M3.8148 6.89679L1.50007 6.91235L1 6.54646L4.72117 1.6498L8.26774 1L4.48727 5.97771L3.8148 6.89679ZM6.8148 10.8968L4.50007 10.9123L4 10.5465L7.72117 5.64981L11.2677 5L7.48727 9.97771L6.8148 10.8968Z"
                                                                fill="#B7B7D7"
                                                            />
                                                        </svg>

                                                        <div>
                                                            Create Proposals
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                            <div
                                className={`transition-all bg-stake-dark-400 hover:bg-[#454765] ${styles.stakeMenuItem} p-4 md:p-8`}
                            >
                                <div className="relative">
                                    <ICStakeMintAoc className="text-ash-gray-600/30 h-18 absolute top-0 right-0" />
                                    <div className="mb-12">
                                        <div className="w-12 mb-2">
                                            <Image
                                                src={ImgMintGem}
                                                alt="farming icon"
                                                layout="responsive"
                                            />
                                        </div>

                                        <div className="text-stake-green-500 text-sm font-bold">
                                            Mint Stake
                                        </div>
                                    </div>
                                    <div className="text-stake-gray-500 bg-ash-dark-400/30 p-6 text-sm font-bold">
                                        On developing...
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                >
                    <div>
                        <OnboardTooltip
                            open={onboaringFarmFromAddedLp && isSuccessful}
                            placement="bottom-start"
                            zIndex={10}
                            onArrowClick={() =>
                                setOnboardedFarmFromAddedLp(true)
                            }
                            content={
                                <OnboardTooltip.Panel>
                                    <div className="text-white text-xs font-bold p-3 max-w-[16rem]">
                                        <span>
                                            After you add liquidity you can{" "}
                                        </span>
                                        <span className="text-stake-green-500">
                                            stake{" "}
                                        </span>
                                        <span>your LP tokens in a </span>
                                        <span className="text-ash-cyan-500">
                                            [LP-Stake farm]{" "}
                                        </span>
                                        <span>to earn more rewards!</span>
                                    </div>
                                </OnboardTooltip.Panel>
                            }
                        >
                            <div>
                                <button
                                    className={`${styles.btn} outline-none`}
                                >
                                    <ICStake className="inline-block w-4 h-4 md:mr-2 transition-none" />
                                    <div className="flex items-center">
                                        <span className="truncate">Stake</span>
                                        <ICChevronDown className="inline w-2 ml-1 transition-none" />
                                    </div>
                                </button>
                            </div>
                        </OnboardTooltip>
                    </div>
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
                <div className="grow overflow-auto">
                    <div className="px-6 pb-[3.75rem]">
                        <div className="mb-9 text-2xl font-bold">Stake</div>
                        <div className="grid grid-cols-1 gap-4">
                            {SOCIALS.map(({ name, url }) => {
                                return (
                                    <HeadlessLink
                                        key={name}
                                        href={url}
                                        onClick={() => setMIsOpen(false)}
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
        </div>
    );
}

export default StakeMenu;
