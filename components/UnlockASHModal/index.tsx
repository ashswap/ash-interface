import BaseModal, { BaseModalType } from "components/BaseModal";
import { useScreenSize } from "hooks/useScreenSize";
import React, { useMemo, useState } from "react";
import ImgLKASHLogo from "assets/images/lk-ash-logo.png";
import ICArrowDownRounded from "assets/svg/arrow-down-rounded.svg";
import Image from "components/Image";
import Avatar from "components/Avatar";
import { formatAmount } from "helper/number";
import useUnlockBtn from "hooks/useUnlockBtn";
import { ASH_ESDT } from "const/tokens";
import BigNumber from "bignumber.js";
import GlowingButton from "components/GlowingButton";
import UnlockASHInfoModal from "./UnlockASHInfoModal";
function UnlockASHModal(props: BaseModalType) {
    const [isOpenInfo, setIsOpenInfo] = useState(false);
    const screenSize = useScreenSize();
    const { unlockAllLKASH, disabled, lkASHList } = useUnlockBtn();
    const totalLKAmount = useMemo(() => {
        return (
            lkASHList
                ?.reduce((s, t) => s.plus(t.balance), new BigNumber(0))
                .div(10 ** ASH_ESDT.decimals).toNumber() || 0
        );
    }, [lkASHList]);
    return (
        <>
            <BaseModal
                {...props}
                type={screenSize.isMobile ? "drawer_btt" : "modal"}
                className={`bg-stake-dark-400 text-white p-4 flex flex-col max-h-full max-w-[51.75rem] sm:min-w-[34rem] mx-auto overflow-hidden`}
            >
                <div className="flex justify-end mb-3.5">
                    <BaseModal.CloseBtn />
                </div>
                <div className="-mx-4 pb-8 px-6 font-bold text-xl sm:text-2xl text-white text-center">
                    Unlock LKASH
                </div>
                <div className="grow px-6 mb-7.5">
                    <div className="p-10 mb-7 bg-stake-dark-500 flex flex-col space-y-11">
                        <div>
                            <div className="mb-4 font-bold text-sm sm:text-lg text-stake-gray-500">
                                Your LKASH
                            </div>
                            <div className="flex items-center">
                                <Avatar
                                    src={ImgLKASHLogo}
                                    className="w-6 h-6 mr-4"
                                />
                                <div className="font-bold text-xl sm:text-3xl">
                                    {formatAmount(totalLKAmount, {
                                        notation: "standard",
                                    })}{" "}
                                    LKASH
                                </div>
                            </div>
                        </div>
                        <ICArrowDownRounded className="w-3 h-3 text-white" />
                        <div>
                            <div className="mb-4 font-bold text-sm sm:text-lg text-stake-gray-500">
                                After unlocking, you&apos;ll receive:
                            </div>
                            <div className="flex items-center">
                                <Avatar
                                    src={ASH_ESDT.logoURI}
                                    className="w-6 h-6 mr-4"
                                />
                                <div className="font-bold text-xl sm:text-3xl">
                                    {formatAmount(totalLKAmount, {
                                        notation: "standard",
                                    })}{" "}
                                    ASH
                                </div>
                            </div>
                        </div>
                    </div>
                    <GlowingButton
                        theme="pink"
                        className="w-full h-16 sm:h-[5.5rem] font-bold text-lg"
                        disabled={disabled}
                        onClick={(e) => {
                            setIsOpenInfo(true);
                            unlockAllLKASH();
                            props.onRequestClose?.(e)
                        }}
                    >
                        Confirm Unlock
                    </GlowingButton>
                </div>
            </BaseModal>
            <UnlockASHInfoModal
                isOpen={isOpenInfo}
                onRequestClose={() => setIsOpenInfo(false)}
            />
        </>
    );
}

export default UnlockASHModal;
