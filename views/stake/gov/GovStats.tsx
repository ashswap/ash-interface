import React, { useState } from "react";
import ICMinus from "assets/svg/minus.svg";
import ICPlus from "assets/svg/plus.svg";
import ICLock from "assets/svg/lock.svg";
import ICCapacity from "assets/svg/capacity.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";
import ImgUsdt from "assets/images/usdt-icon.png";
import Image from "next/image";
import ImgMintRisk from "assets/images/mint-stake-risk.png";
import MintAOCModal from "components/MintAOCModal";
import GOVStakeModal from "components/GOVStakeModal";

function GovStats() {
    const [isQAExpand, setIsQAExpand] = useState(false);
    const [openStakeGov, setOpenStakeGov] = useState(false);
    return (
        <>
            <div className="flex flex-col md:flex-row">
                <div className="md:w-[21.875rem] flex-shrink-0 flex flex-col px-7 lg:px-9 pb-9 pt-7 lg:pt-14 bg-stake-dark-400 mb-4 md:mb-0 md:mr-[1.875rem]">
                    <h2 className="text-lg md:text-2xl mb-11 md:mb-11 font-bold text-white">
                        Your staked
                    </h2>
                    <div className="flex flex-col space-y-6">
                        <div className="bg-ash-dark-400/30 px-[1.25rem] pt-7 pb-5">
                            <div className="px-5 mb-7">
                                <div className="text-stake-gray-500 text-sm font-bold underline uppercase mb-7">
                                    your reward
                                </div>
                                <div className="flex items-center">
                                    <div className="w-[1.125rem] h-[1.125rem] mr-2">
                                        <Image src={ImgUsdt} alt="token icon" />
                                    </div>
                                    <div className="text-lg">
                                        <span className="text-ash-gray-500">
                                            $
                                        </span>
                                        <span className="text-white font-bold">
                                            0
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="bg-ash-cyan-500 text-ash-dark-400 text-sm font-bold w-full h-[3.375rem] flex items-center justify-center">
                                Harvest
                            </button>
                        </div>
                        <div className="bg-ash-dark-400/30 px-[1.25rem] pt-7 pb-5">
                            <div className="px-5 mb-7">
                                <div className="text-stake-gray-500 text-sm font-bold underline uppercase mb-7">
                                    your staked ash
                                </div>
                                <div className="flex items-center">
                                    <div className="w-[1.125rem] h-[1.125rem] mr-2">
                                        <Image src={ImgUsdt} alt="token icon" />
                                    </div>
                                    <div className="text-lg text-white font-bold">
                                        0
                                    </div>
                                </div>
                            </div>
                            <button className="bg-ash-dark-400 text-stake-gray-500 text-sm font-bold w-full h-[3.375rem] flex items-center justify-center">
                                <ICLock className="w-6 h-6 mr-2" />
                                <span>lock period</span>
                            </button>
                        </div>
                        <div className="bg-ash-dark-400/30 px-[1.25rem] pt-7 pb-5">
                            <div className="px-5 mb-7">
                                <div className="text-stake-gray-500 text-sm font-bold underline uppercase mb-7">
                                    your veASH
                                </div>
                                <div className="flex items-center">
                                    <div className="w-[1.125rem] h-[1.125rem] mr-2">
                                        <Image src={ImgUsdt} alt="token icon" />
                                    </div>
                                    <div className="text-lg text-white font-bold">
                                        0
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <div className="bg-ash-dark-400 text-stake-gray-500 px-3 py-2 w-7/12 h-[3.375rem] overflow-hidden">
                                    <div className="flex items-center">
                                        <ICLock className="w-3 h-3 mr-1" />
                                        <span className="text-2xs font-bold underline">
                                            Lock
                                        </span>
                                    </div>
                                    <div>_</div>
                                </div>
                                <div className="bg-ash-dark-400 text-stake-gray-500 px-3 py-2 w-5/12 h-[3.375rem] overflow-hidden">
                                    <div className="flex items-center">
                                        <ICCapacity className="w-3 h-3 mr-1" />
                                        <span className="text-2xs font-bold underline">
                                            Capacity
                                        </span>
                                    </div>
                                    <div>_</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="bg-pink-600 text-white text-lg font-bold w-full h-[4.5rem] flex items-center justify-center mt-3" onClick={(() => setOpenStakeGov(true))}>
                        Start staking
                    </button>
                </div>
                <div className="flex-grow px-7 lg:px-16 pt-7 lg:pt-14 pb-9 bg-stake-dark-400">
                    <h2 className="text-lg md:text-2xl mb-10 md:mb-11 font-bold text-white">
                        Overall stats
                    </h2>
                    <div className="grid grid-cols-2 gap-x-7.5 gap-y-6 mb-16">
                        <div className="bg-ash-dark-400/30 px-[2.375rem] py-7 flex flex-col justify-between">
                            <div className="text-stake-gray-500 text-sm font-bold mb-2 leading-tight">
                                APR
                            </div>
                            <div className="text-pink-600 text-lg font-bold leading-tight">
                                931%
                            </div>
                        </div>
                        <div className="bg-ash-dark-400/30 px-[2.375rem] py-7 flex flex-col justify-between">
                            <div className="text-stake-gray-500 text-sm font-bold mb-2 uppercase leading-tight">
                                PERCENTAGE of total ASH Locked
                            </div>
                            <div className="text-white text-lg font-bold leading-tight">
                                131%
                            </div>
                        </div>
                        <div className="bg-ash-dark-400/30 px-[2.375rem] py-7 flex flex-col justify-between">
                            <div className="text-stake-gray-500 text-sm font-bold mb-6">
                                TOTAL STAKED ASH
                            </div>
                            <div className="flex items-center">
                                <div className="w-[1.125rem] h-[1.125rem] mr-2">
                                    <Image src={ImgUsdt} alt="token icon" />
                                </div>
                                <div className="text-white text-lg font-bold">
                                    1,091,291.012512
                                </div>
                            </div>
                        </div>
                        <div className="bg-ash-dark-400/30 px-[2.375rem] py-7 flex flex-col justify-between">
                            <div className="text-stake-gray-500 text-sm font-bold mb-6">
                                TOTAL veASH
                            </div>
                            <div className="flex items-center">
                                <div className="w-[1.125rem] h-[1.125rem] mr-2">
                                    <Image src={ImgUsdt} alt="token icon" />
                                </div>
                                <div className="text-white text-lg font-bold">
                                    1,091,291.012512
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-16">
                        <div className="text-stake-gray-500 text-sm font-bold mb-4">
                            TIPS
                        </div>
                        <div className="text-sm mb-9">
                            Stake ASH to receive veASH. You can both earn from
                            transaction fee & have a power for voting!
                        </div>
                        <ul>
                            <li className="text-sm font-bold">
                                <span className="text-stake-green-500">1</span>{" "}
                                ASH locked for{" "}
                                <span className="text-stake-green-500">
                                    4 years
                                </span>{" "}
                                ={" "}
                                <span className="text-stake-green-500">1</span>{" "}
                                veASH
                            </li>
                            <li className="text-sm font-bold">
                                <span className="text-stake-green-500">1</span>{" "}
                                ASH locked for{" "}
                                <span className="text-stake-green-500">
                                    3 years
                                </span>{" "}
                                ={" "}
                                <span className="text-stake-green-500">
                                    0.75
                                </span>{" "}
                                veASH
                            </li>
                            <li className="text-sm font-bold">
                                <span className="text-stake-green-500">1</span>{" "}
                                ASH locked for{" "}
                                <span className="text-stake-green-500">
                                    2 years
                                </span>{" "}
                                ={" "}
                                <span className="text-stake-green-500">
                                    0.5
                                </span>{" "}
                                veASH
                            </li>
                            <li className="text-sm font-bold">
                                <span className="text-stake-green-500">1</span>{" "}
                                ASH locked for{" "}
                                <span className="text-stake-green-500">
                                    1 years
                                </span>{" "}
                                ={" "}
                                <span className="text-stake-green-500">
                                    0.25
                                </span>{" "}
                                veASH
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div className="text-whtie text-sm font-bold mb-5">
                            IMPORTANT NOTE
                        </div>
                        <div className="mb-6">
                            Your veASH weight gradually decreases as your
                            escrowed tokens approach their lock expiry.
                        </div>
                        <div className="bg-ash-dark-400/30">
                            <button
                                className="w-full h-[4.25rem] px-[2.375rem] flex items-center justify-between text-pink-600"
                                onClick={() => setIsQAExpand((val) => !val)}
                            >
                                <div className="line-clamp-2 text-sm font-bold">
                                    OMG? Does it mean user will lose money
                                    everyday?
                                </div>
                                {isQAExpand ? (
                                    <ICChevronUp className="w-3 h-auto" />
                                ) : (
                                    <ICChevronDown className="w-3 h-auto" />
                                )}
                            </button>
                            {isQAExpand && (
                                <div className="-mt-1 pb-8 px-[2.375rem] text-2xs">
                                    <div className="mb-4">
                                        Of course not, when your veASH decreases
                                        to 0. It also means that the lock period
                                        of your ASH is done. You can withdraw
                                        your staked ASH right away.
                                    </div>
                                    <div>
                                        However, If you want to keep your veASH
                                        stays on the maximum, just{" "}
                                        <span className="text-pink-600 underline font-bold">
                                            extend
                                        </span>{" "}
                                        your lock period everyday.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <GOVStakeModal open={openStakeGov} onClose={() => setOpenStakeGov(false)}/>
        </>
    );
}

export default GovStats;
