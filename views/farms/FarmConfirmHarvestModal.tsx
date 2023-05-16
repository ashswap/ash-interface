import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal, { BaseModalType } from "components/BaseModal";
import TextAmt from "components/TextAmt";
import { TokenAmount } from "helper/token/tokenAmount";
import { useScreenSize } from "hooks/useScreenSize";
import { memo, useMemo } from "react";
import { useRecoilValue } from "recoil";

type Props = {
    rewards: TokenAmount[];
};
const Content = memo(function Content({ rewards }: Props) {
    const tokenMap = useRecoilValue(tokenMapState);
    const totalRewardsValue = useMemo(() => {
        return (
            rewards.reduce(
                (s, r) =>
                    s.plus(
                        r.egld.multipliedBy(
                            tokenMap[r.token.identifier]?.price || 0
                        )
                    ),
                new BigNumber(0)
            ) || new BigNumber(0)
        );
    }, [tokenMap, rewards]);
    return (
        <div className="p-6 pt-0 sm:p-12 sm:pt-0">
            <div className="mb-9 font-bold text-xl sm:text-2xl text-white">Confirm transaction on your wallet to harvest</div>
            <div className="min-w-[14rem] p-9 bg-stake-dark-500">
                <div>
                    <span>&asymp;&nbsp;</span>
                    <TextAmt
                        number={totalRewardsValue}
                        prefix={
                            <span className="font-medium text-stake-gray-500">
                                $
                            </span>
                        }
                        className="font-bold text-2xl text-white"
                        decimalClassName="text-stake-gray-500"
                        options={{ notation: "standard" }}
                    />
                </div>
                <div className="mt-10 font-bold text-xs text-stake-gray-500">Rewards details</div>
                <div className={`space-y-2 ${!rewards.length ? "" : "mt-5"}`}>
                    {rewards.map((r) => {
                        return (
                            <div
                                key={r.token.identifier}
                                className="flex justify-between items-center"
                            >
                                <div className="flex items-center">
                                    <Avatar
                                        src={r.token.logoURI}
                                        alt={r.token.name}
                                        className="w-4 h-4 mr-2"
                                    />
                                    <span className="font-bold text-xs text-white">
                                        {r.token.symbol}
                                    </span>
                                </div>
                                <TextAmt
                                    number={r.egld}
                                    className="font-medium text-xs"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

const FarmConfirmHarvestModal: React.FC<Props & BaseModalType> = ({
    rewards,
    ...modalProps
}) => {
    const { isMobile } = useScreenSize();

    return (
        <BaseModal
            {...modalProps}
            type={`${isMobile ? "drawer_btt" : "modal"}`}
            className="clip-corner-4 clip-corner-tl bg-stake-dark-400 p-4 flex flex-col max-h-[calc(100%-2.75rem)] sm:max-h-full sm:max-w-md"
        >
            <div className="flex justify-end mb-4">
                <BaseModal.CloseBtn />
            </div>
            {modalProps.isOpen && <Content rewards={rewards} />}
        </BaseModal>
    );
};

export default memo(FarmConfirmHarvestModal);
