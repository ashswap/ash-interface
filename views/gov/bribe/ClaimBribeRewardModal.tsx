import ICBribe from "assets/svg/bribe.svg";
import ICChevronRight from "assets/svg/chevron-right.svg";
import { fbClaimableRewardsSelector, fbTotalClaimableUSDSelector } from "atoms/farmBribeState";
import Avatar from "components/Avatar";
import BaseModal, { BaseModalType } from "components/BaseModal";
import GlowingButton from "components/GlowingButton";
import TextAmt from "components/TextAmt";
import useFBAllClaimRewards from "hooks/useFarmBribeContract/useFBAllClaimRewards";
import { useScreenSize } from "hooks/useScreenSize";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
type ClaimBribeRewardProps = {
    farmAddress: string;
    onClose?: () => void;
};
const ClaimBribeRewardContent = ({farmAddress, onClose}: ClaimBribeRewardProps) => {
    const {fbClaimAllRewards, trackingData: {isPending, isSuccessful}} = useFBAllClaimRewards(true);
    const rewards = useRecoilValue(fbClaimableRewardsSelector(farmAddress));
    const totalRewardUSD = useRecoilValue(fbTotalClaimableUSDSelector(farmAddress));
    useEffect(() => {
        if(isSuccessful){
            onClose?.();
        }
    }, [isSuccessful, onClose]);
    return (
        <div className="px-6 lg:px-12 pb-12 overflow-auto relative">
            <div className="font-bold text-2xl text-white">
                Claim Bribe Reward
            </div>
            <div className="mt-10 mb-5 pt-16 pb-9 bg-stake-dark-500 px-9 relative">
                <div className="absolute left-8 -top-7">
                    <ICBribe className="w-16 h-16 text-yellow-500 colored-drop-shadow-xs colored-drop-shadow-yellow-500" />
                </div>
                <div className="text-sm text-stake-gray-500 mb-10">
                    <span>~ $</span>
                    <TextAmt
                        number={totalRewardUSD}
                        options={{ notation: "standard" }}
                        className="text-yellow-500 font-bold"
                        decimalClassName="text-stake-gray-500"
                    ></TextAmt>
                </div>
                <div className="font-bold text-xs text-stake-gray-500 mb-4">
                    Rewards details
                </div>
                <div className="overflow-auto">
                    {rewards.map((r) => {
                        return (
                            <div
                                key={r.token.identifier}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <Avatar
                                        src={r.token.logoURI}
                                        className="w-3.5 h-3.5 mr-2"
                                    />
                                    <span className="font-bold text-xs text-white">
                                        {r.token.symbol}
                                    </span>
                                </div>
                                <TextAmt number={r.egld} />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="border-notch-x border-notch-white/50">
                <GlowingButton
                    theme="yellow"
                    className="w-full clip-corner-1 clip-corner-tl uppercase h-12 text-xs sm:text-sm font-bold text-stake-dark-400"
                    disabled={isPending}
                    onClick={() => fbClaimAllRewards(farmAddress)}
                >
                    <div className="flex items-center space-x-2.5">
                        <span>Claim</span>
                        <ICChevronRight className="w-3 h-3" />
                    </div>
                </GlowingButton>
            </div>
        </div>
    );
};
function ClaimBribeRewardModal({
    farmAddress,
    onClose,
    ...modalProps
}: BaseModalType & ClaimBribeRewardProps) {
    const screenSize = useScreenSize();
    return (
        <>
            <BaseModal
                {...modalProps}
                onRequestClose={(e) => {onClose?.(); modalProps.onRequestClose?.(e);}}
                type={screenSize.isMobile ? "drawer_btt" : "modal"}
                className={`clip-corner-4 clip-corner-tl bg-stake-dark-400 text-white p-4 flex flex-col overflow-hidden max-h-full w-screen sm:max-w-[30rem] mx-auto`}
            >
                <div className="flex justify-end mb-3.5">
                    <BaseModal.CloseBtn />
                </div>
                <div className="flex-grow overflow-auto">
                    <ClaimBribeRewardContent farmAddress={farmAddress} onClose={onClose} />
                </div>
            </BaseModal>
        </>
    );
}

export default ClaimBribeRewardModal;
