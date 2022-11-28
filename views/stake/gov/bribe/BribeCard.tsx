import React, { useState } from "react";
import ICBribe from "assets/svg/bribe.svg";
import ICLock from "assets/svg/lock.svg";
import ICCapacity from "assets/svg/capacity.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import useFarmBribeData from "hooks/useFarmBribeData";
import Avatar from "components/Avatar";
import GlowingButton from "components/GlowingButton";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import ClaimBribeRewardModal from "./ClaimBribeRewardModal";
type Props = {
    farmAddress: string;
};
function BribeCard({ farmAddress }: Props) {
    const { pool, rewards, claimableRewards } = useFarmBribeData(farmAddress);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOpenClaim, setIsOpenClaim] = useState(false);
    if (!pool) return null;
    return (
        <>
        <div className="relative">
            <div className="clip-corner-4 clip-corner-br bg-stake-dark-400 p-4 relative">
                <div className="px-6 pt-6 pb-2">
                    <div className="flex">
                        <div className="grow overflow-hidden">
                            <div className="flex -space-x-2 mb-3">
                                {pool.tokens.map((t, i) => (
                                    <Avatar
                                        key={t.identifier}
                                        className={`w-10 h-10`}
                                        src={t.logoURI}
                                    />
                                ))}
                            </div>
                            <div className="font-bold text-2xl text-white mb-2 truncate">
                                {pool.tokens.map((t) => t.symbol).join("-")}
                            </div>
                            <div className="font-bold text-xs text-stake-gray-500">
                                Vote to earn rewards
                            </div>
                        </div>
                        <div className="shrink-0 w-24 flex flex-col justify-end p-2 -mt-10 -mr-10 bg-stake-gray-500/10">
                            <div className="mb-7 font-bold text-sm text-stake-gray-500">
                                ~ <span className="font-normal">$</span>
                                <TextAmt
                                    number={3439.12}
                                    options={{ notation: "standard" }}
                                    className="text-yellow-500"
                                    decimalClassName="text-stake-gray-500"
                                />
                            </div>
                            <GlowingButton
                                theme="yellow"
                                className="clip-corner-1 clip-corner-br w-full py-2 px-2 truncate font-bold text-xs text-ash-dark-400"
                                onClick={() => setIsOpenClaim(true)}
                            >
                                Claim
                            </GlowingButton>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 items-center mt-16">
                        <div className="font-bold">
                            <div className="text-xs text-stake-gray-500 underline mb-2">
                                Total treasures
                            </div>
                            <div>
                                <span className="font-normal text-stake-gray-500">
                                    $
                                </span>
                                <TextAmt
                                    number={3439.12}
                                    options={{ notation: "standard" }}
                                />
                            </div>
                        </div>
                        <GlowingButton
                            theme="pink"
                            className="w-full h-14 clip-corner-1 clip-corner-br flex items-center font-bold"
                        >
                            Vote
                        </GlowingButton>
                    </div>
                    {isExpanded && (
                        <div className="mt-6 p-8 bg-stake-dark-500">
                            <div className="mb-4 font-bold text-xs text-stake-gray-500">
                                Treasures details
                            </div>
                            <div className="space-y-1">
                                {rewards.map((rwd) => (
                                    <div
                                        key={rwd.token.identifier}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center">
                                            <Avatar
                                                className="w-3.5 h-3.5 mr-1"
                                                src={rwd.token.logoURI}
                                            />
                                            <div className="font-bold text-white">
                                                {rwd.token.symbol}
                                            </div>
                                        </div>
                                        <TextAmt
                                            number={rwd.egld}
                                            className="font-semibold"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-x-2 mt-6">
                        <div className="bg-ash-dark-400 text-stake-gray-500 px-3 py-2 h-[3.375rem] overflow-hidden">
                            <div className="flex items-center mb-2">
                                <ICLock className="w-3 h-3 mr-1" />
                                <CardTooltip
                                    disabled
                                    content={
                                        <div>
                                            Your lock period. When this period
                                            ends, you can claim back your staked
                                            ASH.
                                        </div>
                                    }
                                >
                                    <span className="text-2xs font-bold underline">
                                        Lock
                                    </span>
                                </CardTooltip>
                            </div>
                            <div className="text-xs font-bold">
                                03th Oct, 2022
                            </div>
                        </div>
                        <div className="bg-ash-dark-400 text-stake-gray-500 px-3 py-2 h-[3.375rem] overflow-hidden">
                            <div className="flex items-center mb-2">
                                <ICCapacity className="w-3 h-3 mr-1" />
                                <CardTooltip
                                    disabled
                                    content={
                                        <div>
                                            Percentage of your veASH to the
                                            total veASH in ASHSWAP Governance
                                            Stake. It depends on the reward that
                                            you’ll receive.
                                        </div>
                                    }
                                >
                                    <span className="text-2xs font-bold underline">
                                        Capacity
                                    </span>
                                </CardTooltip>
                            </div>
                            <div className="text-xs font-bold">0%</div>
                        </div>
                    </div>
                    <div className="mt-14 flex justify-center">
                        <button
                            className="flex items-center font-bold text-sm text-white"
                            onClick={() => setIsExpanded((val) => !val)}
                        >
                            <span className="mr-2">Detail</span>{" "}
                            {isExpanded ? <ICChevronUp /> : <ICChevronDown />}{" "}
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute right-4 -top-6">
                <ICBribe className="w-16 h-16 text-pink-600 colored-drop-shadow-xs colored-drop-shadow-pink-600" />
            </div>
        </div>
        <ClaimBribeRewardModal isOpen={isOpenClaim} onRequestClose={() => setIsOpenClaim(false)}/>
        </>
    );
}

export default BribeCard;
