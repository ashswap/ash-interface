import BaseModal, { BaseModalType } from "components/BaseModal";
import { useScreenSize } from "hooks/useScreenSize";
import Image from "next/image";
import React from "react";
import { FarmRecord } from "./FarmsState";
import ICChevronRight from "assets/svg/chevron-right.svg";
import ICGovBoost from "assets/svg/gov-boost.svg";
import ICEqual from "assets/svg/equal.svg";
import BoostBar from "components/BoostBar";

type FarmBoostInfoType = {
    farmData: FarmRecord;
};
const FarmBoostInfo = ({ farmData }: FarmBoostInfoType) => {
    const { pool } = farmData;
    const [token1, token2] = pool?.tokens;
    return (
        <div className="px-2 sm:px-12 py-4">
            <div className="flex justify-between mb-14">
                <div>
                    <div className="flex items-center mb-4">
                        <div className="w-9 h-9">
                            <Image
                                src={token1?.icon}
                                alt={token1?.name}
                                layout="responsive"
                            />
                        </div>
                        <div className="w-9 h-9 -ml-1">
                            <Image
                                src={token2?.icon}
                                alt={token2?.name}
                                layout="responsive"
                            />
                        </div>
                    </div>
                    <div className="text-sm font-bold text-stake-gray-500">
                        {token1?.name}-{token2?.name}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-lg sm:text-2xl text-white font-bold mb-2">
                        Boost information
                    </div>
                    <div className="text-xs font-bold text-stake-gray-500 underline">
                        This boosting data will remain till
                    </div>
                    <div className="text-xs font-bold text-stake-gray-500 underline">
                        24 Ferb, 2020. UTC +0:00
                    </div>
                </div>
            </div>
            <div>
                <div className="flex items-end mb-3.5">
                    <div className="flex flex-col text-right w-1/2">
                        <div className="text-xs font-bold text-white mb-2">
                            Your current{" "}
                            <span className="underline">veASH</span>
                        </div>
                        <div className="h-10 px-6 flex items-center justify-end text-sm font-bold text-stake-gray-500 bg-ash-dark-400/30">
                            2,500
                        </div>
                    </div>
                    <div className="h-10 flex items-center w-1/6 sm:w-1/4">
                        <div className="border-t border-dashed border-stake-gray-500 flex-grow"></div>
                        <ICChevronRight className="w-2 h-2" />
                    </div>
                    <div className="flex flex-col text-right w-1/3 sm:w-1/4">
                        <div className="text-xs font-bold text-white mb-2 underline">
                            Current boost
                        </div>
                        <div className="h-10">
                            <BoostBar height={40}>
                                <div className="px-4 h-full flex items-center justify-end text-lg font-bold text-stake-gray-500">
                                    <span>x</span>
                                    <span className="text-white">1</span>
                                    <ICGovBoost className="w-3.5 h-3.5 inline-block -mt-0.5 ml-1" />
                                </div>
                            </BoostBar>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end mb-8">
                    <div className="w-4.5 h-4.5 bg-pink-600/10 flex items-end mr-2">
                        <ICEqual className="w-3.5 h-2.5 text-pink-600" />
                    </div>
                    <span className="text-pink-600 underline text-xs font-bold">
                        Calculate
                    </span>
                </div>
                <div className="flex items-end mb-14">
                    <div className="flex flex-col text-right w-1/2">
                        <div className="text-xs font-bold text-stake-gray-500 mb-2">
                            veASH for max boost
                        </div>
                        <div className="h-10 px-6 flex items-center justify-end text-sm font-bold text-stake-gray-500 bg-ash-dark-400/30">
                            1,000,000
                        </div>
                    </div>
                    <div className="h-10 flex items-center w-1/6 sm:w-1/4">
                    </div>
                    <div className="flex flex-col text-right w-1/3 sm:w-1/4">
                        <div className="text-xs font-bold text-stake-gray-500 mb-2 underline">
                            Max boost possible
                        </div>
                        <div className="h-10">
                            <BoostBar height={40} disabled>
                                <div className="px-4 h-full flex items-center justify-end text-lg font-bold text-stake-gray-500">
                                    <span>x</span>
                                    <span>2.5</span>
                                    <ICGovBoost className="w-3.5 h-3.5 inline-block -mt-0.5 ml-1" />
                                </div>
                            </BoostBar>
                        </div>
                    </div>
                </div>
                <div className="bg-stake-dark-500 text-yellow-600 text-xs font-bold text-center px-6 py-4">
                By holding veASH, your farm will automatically boosted without any actions.
                </div>
            </div>
        </div>
    );
};
type props = BaseModalType & FarmBoostInfoType;
function FarmBoostInfoModal({ farmData, ...modalProps }: props) {
    const screenSize = useScreenSize();
    return (
        <BaseModal
            {...modalProps}
            type={screenSize.isMobile ? "drawer_btt" : "modal"}
            className={`bg-stake-dark-400 text-white p-4 flex flex-col overflow-hidden max-h-full w-screen max-w-[40rem] mx-auto`}
        >
            <div className="flex justify-end mb-3.5">
                <BaseModal.CloseBtn />
            </div>
            <div className="flex-grow overflow-auto">
                <FarmBoostInfo farmData={farmData} />
            </div>
        </BaseModal>
    );
}

export default FarmBoostInfoModal;
