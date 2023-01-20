import BaseModal, { BaseModalType } from "components/BaseModal";
import Image from "components/Image";
import React from "react";
import ImgBgMainnetPrac from "assets/images/bg-mainnet-prac.png";
import ImgBgRewardPool from "assets/images/bg-reward-pool.png";
import GlowingButton from "components/GlowingButton";
import { useScreenSize } from "hooks/useScreenSize";
import Link from "next/link";
import { useRouter } from "next/router";
function UnlockASHModal(props: BaseModalType) {
    const screenSize = useScreenSize();
    const router = useRouter();
    return (
        <BaseModal
            {...props}
            type={screenSize.isMobile ? "drawer_btt" : "modal"}
            className={`bg-stake-dark-400 text-white p-4 flex flex-col max-h-full max-w-[51.75rem] mx-auto overflow-hidden`}
        >
            <div className="flex justify-end mb-3.5">
                <BaseModal.CloseBtn />
            </div>
            <div className="-mx-4 pb-8 px-6 font-bold text-xl sm:text-2xl text-pink-600 text-center border-b border-dashed border-b-stake-gray-500">
                Confirm tx on Wallet to start unlock.
            </div>
            <div className="grow px-10 md:px-20 py-14">
                <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="mb-10 sm:mb-0 sm:w-1/3">
                        <div className="mb-6 font-bold text-xl sm:text-3xl text-white">
                            Don&apos;t waste your ASH!
                        </div>
                        <div className="font-bold text-base sm:text-lg text-stake-gray-500">
                            After unlock, stake your ASH to join Mainnet Event
                            of AshSwap!
                        </div>
                    </div>
                    <div className="sm:w-2/3 relative">
                        <div className="absolute -top-6 left-4 right-0 w-10 sm:w-14">
                            <Image
                                src={ImgBgMainnetPrac}
                                alt=""
                                layout="responsive"
                            />
                        </div>
                        <div
                            className="bg-ash-purple-500 drop-shadow-[0px_4px_150px_rgba(123,97,255,0.5)] ml-10 py-10 pl-8 pr-4 sm:py-14 sm:pl-12 sm:pr-6 flex flex-col bg-no-repeat bg-right-bottom"
                            style={{
                                backgroundImage: `url(${ImgBgRewardPool.src})`,
                                backgroundSize: "auto 80%",
                            }}
                        >
                            <div className="mb-5 font-bold text-base sm:text-xl lg:text-2xl text-white">
                                ASH Staking
                            </div>
                            <div className="font-amaz text-4xl sm:text-6xl lg:text-7xl text-white leading-none">
                                Reward <br /> pool
                            </div>
                        </div>
                    </div>
                </div>
                <Link href="/reward-pool" scroll={router.pathname !== "/reward-pool"}>
                    <a>
                        <GlowingButton
                            theme="pink"
                            className="mt-20 w-full h-14 md:h-[5.5rem] font-bold text-lg"
                            onClick={(e) => props.onRequestClose?.(e)}
                        >
                            Joint Event Now!
                        </GlowingButton>
                    </a>
                </Link>
            </div>
        </BaseModal>
    );
}

export default UnlockASHModal;
