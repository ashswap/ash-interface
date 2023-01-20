import ImgAshIcon from "assets/images/ash-icon.png";
import ImgBgMainnetPrac from "assets/images/bg-mainnet-prac.png";
import ImgBgRewardPool from "assets/images/bg-reward-pool.png";
import ImgPhoenix from "assets/images/phoenix.png";
import Avatar from "components/Avatar";
import Countdown from "components/Coundown";
import GlowingButton from "components/GlowingButton";
import Image from "components/Image";
import UnlockASHModal from "components/UnlockASHModal";
import { LAUNCH_TS, TOTAL_REWARD_POOL } from "const/mainnet";
import { formatAmount } from "helper/number";
import Link from "next/link";
import { memo, useState } from "react";
function CountdownMainnet() {
    const [isOpenUnlockModal, setIsOpenUnlockModal] = useState(false);
    return (
        <>
            <div className="overflow-hidden min-h-screen">
                <div className="ash-container pt-14 pb-20 text-xl">
                    <div className="mb-18 flex flex-col items-center text-center">
                        <h1 className="mb-9 font-bold text-4xl text-white">
                            AshSwap Mainnet Going Live In...
                        </h1>

                        <Countdown timestamp={LAUNCH_TS} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-32 md:gap-8 xl:gap-10 md:-mx-6">
                        <div className="relative">
                            <div className="absolute -top-14 left-4 right-0 w-18 md:w-20 lg:w-[105px]">
                                <Image
                                    src={ImgBgMainnetPrac}
                                    alt=""
                                    layout="responsive"
                                />
                            </div>
                            <div
                                className="bg-ash-purple-500 drop-shadow-[0px_4px_150px_rgba(123,97,255,0.5)] ml-18 lg:ml-[5.5rem] py-10 pl-8 pr-4 sm:py-14 sm:pl-12 sm:pr-6 xl:min-h-[536px] flex flex-col bg-no-repeat bg-right-bottom"
                                style={{
                                    backgroundImage: `url(${ImgBgRewardPool.src})`,
                                    backgroundSize: "auto 80%",
                                }}
                            >
                                <div className="mb-5 font-bold text-xl lg:text-2xl text-white">
                                    ASH Staking
                                </div>
                                <div className="font-amaz text-6xl lg:text-7xl xl:text-8xl text-white leading-none">
                                    Reward pool
                                </div>
                                <div className="font-bold text-xl lg:text-2xl text-white mt-16 lg:mt-28 xl:mt-auto">
                                    Stake ASH
                                    <br />
                                    to get reward!
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="mb-28 flex flex-col md:mr-[5.5rem]">
                                <Link href="/reward-pool">
                                    <a>
                                        <GlowingButton
                                            theme="pink"
                                            className="w-full h-16 md:h-[5.5rem] font-bold text-lg"
                                        >
                                            Join Event now!
                                        </GlowingButton>
                                    </a>
                                </Link>
                                <div className="mt-10 text-center">
                                    <button
                                        className="font-bold text-lg text-ash-gray-500 text-center disabled:cursor-not-allowed"
                                        onClick={() => {
                                            setIsOpenUnlockModal(true);
                                        }}
                                    >
                                        Unlock LKASH
                                    </button>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute w-72 sm:w-80 md:w-52 lg:w-[20.625rem] -bottom-4 -right-16 md:bottom-12 md:right-8 lg:bottom-12 lg:right-4 pointer-events-none">
                                    <Image
                                        src={ImgPhoenix}
                                        alt="ashswap"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="mb-6 flex items-center">
                                        <Avatar
                                            src={ImgAshIcon}
                                            alt="ash-icon"
                                            className="w-6 h-6 mr-2"
                                        />
                                        <div className="font-bold text-lg sm:text-2xl text-white">
                                            ASH shared reward pool
                                        </div>
                                    </div>
                                    <div className="font-amaz text-7xl sm:text-9xl md:text-6xl lg:text-9xl xl:text-[150px] text-center md:text-left text-white leading-none lg:-ml-32 xl:ml-[-9.5rem]">
                                        {formatAmount(
                                            TOTAL_REWARD_POOL.toBigNumber().toNumber(),
                                            {
                                                notation: "standard",
                                                isInteger: true,
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <UnlockASHModal isOpen={isOpenUnlockModal} onRequestClose={() => setIsOpenUnlockModal(false)}/>
        </>
    );
}

export default memo(CountdownMainnet);
