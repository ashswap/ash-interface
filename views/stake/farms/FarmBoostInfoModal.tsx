import BaseModal, { BaseModalType } from "components/BaseModal";
import { useScreenSize } from "hooks/useScreenSize";
import { useEffect, useMemo, useState } from "react";

import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronRight from "assets/svg/chevron-right.svg";
import ICEqualSquare from "assets/svg/equal-square.svg";
import ICGovBoost from "assets/svg/gov-boost.svg";
import ICHexagonDuo from "assets/svg/hexagon-duo.svg";
import { accAddressState } from "atoms/dappState";
import {
    farmOwnerTokensQuery,
    FarmRecord,
    FarmToken,
    farmTransferedTokensQuery,
} from "atoms/farmsState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseButton from "components/BaseButton";
import BoostBar, { BoostBarProps } from "components/BoostBar";
import GlowingButton from "components/GlowingButton";
import pools from "const/pool";
import { VE_ASH_DECIMALS } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { formatAmount } from "helper/number";
import {
    useFarmBoostOwnerState,
    useFarmBoostTransferState,
} from "hooks/useFarmBoostState";
import useFarmBoost from "hooks/useFarmContract/useFarmBoost";
import { FarmBoostInfo } from "interface/farm";
import { useRecoilValue } from "recoil";
import FarmBoostTooltip from "./FarmBoostTooltip";
import Link from "next/link";
import useRouteModal from "hooks/useRouteModal";
import { useOnboarding } from "hooks/useOnboarding";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import Delayed from "components/Delayed";

const BoostBarValue = (
    props: Omit<BoostBarProps, "min" | "max" | "height">
) => {
    const MAX = 2.5;
    const MIN = 1;
    const { isMobile } = useScreenSize();
    return (
        <BoostBar {...props} height={isMobile ? 36 : 42} min={MIN} max={MAX}>
            <div className="flex items-center justify-between px-6 text-white h-full font-bold text-xs">
                {(props.value || 1) >= MAX ? (
                    <div>Max</div>
                ) : (
                    <div className="flex items-center">
                        <span className="mr-1">
                            x{formatAmount(props.value)}
                        </span>
                        <ICGovBoost className="-mt-0.5" />
                    </div>
                )}
                <div className="flex items-center">
                    <span className="mr-1">x{MAX}</span>
                    <ICGovBoost className="-mt-0.5" />
                </div>
            </div>
        </BoostBar>
    );
};

const FarmBoostRecord = ({
    farmData,
    label,
    veConsume,
    currentBoost,
    expectedBoost,
    maxBoost,
    veAvailable,
    onSelfBoostTransferedToken,
    booster,
    lpAmt,
}: {
    farmData: FarmRecord;
    label?: string;
    veConsume: BigNumber;
    currentBoost?: FarmBoostInfo;
    expectedBoost?: FarmBoostInfo;
    maxBoost?: FarmBoostInfo;
    veAvailable?: BigNumber;
    onSelfBoostTransferedToken?: () => {};
    booster: string;
    lpAmt: BigNumber;
}) => {
    const [dismissedTooltip, setDismissedTooltip] = useState(false);
    const accAddress = useRecoilValue(accAddressState);
    const farm = farmData.farm;
    const pool = useMemo(() => {
        return pools.find((p) => p.lpToken.id === farm.farming_token_id);
    }, [farm]);
    const isOwner = useMemo(
        () => booster === accAddress,
        [booster, accAddress]
    );
    const zeroVeTooltip = useMemo(() => {
        return isOwner && veAvailable?.eq(0) && !dismissedTooltip;
    }, [isOwner, veAvailable, dismissedTooltip]);
    if (!pool) return null;

    return (
        <div className="grid grid-cols-[minmax(0,auto)_1fr] md:grid-cols-[minmax(0,auto)_1fr_1fr_2fr] items-center">
            <div className="relative mr-2 sm:mr-8">
                <ICHexagonDuo
                    className={`w-9 h-9 sm:w-16 sm:h-16 stroke-transparent ${
                        isOwner
                            ? "fill-ash-cyan-500 colored-drop-shadow-[0px_4px_25px] colored-drop-shadow-ash-cyan-500/25"
                            : "fill-stake-dark-500"
                    }`}
                />
                <FarmBoostTooltip
                    farmData={farmData}
                    booster={booster}
                    lpAmt={lpAmt}
                    onSelfBoostTransferedToken={onSelfBoostTransferedToken}
                >
                    <div
                        className={`absolute inset-0 flex items-center justify-center underline font-bold text-sm sm:text-lg ${
                            isOwner
                                ? "text-ash-dark-600"
                                : "text-stake-gray-500"
                        }`}
                    >
                        {label ? label : isOwner ? "O" : "T"}
                    </div>
                </FarmBoostTooltip>
            </div>
            <div className="hidden md:block space-y-2">
                <div className="text-white text-xs font-bold">
                    veASH consumes
                </div>
                <div
                    className={`text-right h-[2.625rem] px-4 flex items-center justify-end ${
                        isOwner ? "bg-ash-dark-400/30" : "bg-stake-dark-500"
                    }`}
                >
                    {formatAmount(
                        toEGLDD(
                            VE_ASH_DECIMALS,
                            BigNumber.max(veConsume, 0)
                        ).toNumber(),
                        { notation: "standard" }
                    )}
                </div>
                <div className="text-right text-xs font-medium">
                    {isOwner ? (
                        <OnboardTooltip
                            delayOpen={500}
                            offset={30}
                            placement="bottom-end"
                            open={zeroVeTooltip}
                            onArrowClick={() => setDismissedTooltip(true)}
                            content={
                                <OnboardTooltip.Panel className="max-w-[15rem]">
                                    <div className="text-white text-xs font-bold my-3 px-5">
                                        <span className="">
                                            veASH is needed for Farm Boost.{" "}
                                        </span>
                                        <Link href="/stake/gov">
                                            <a>
                                                <span className="underline text-stake-green-500">
                                                    Stake ASH
                                                </span>
                                            </a>
                                        </Link>
                                        <span> to get it now!</span>
                                    </div>
                                </OnboardTooltip.Panel>
                            }
                        >
                            <span>
                                <span className="text-stake-gray-500 underline">
                                    Available:{" "}
                                </span>
                                <span className="text-ash-cyan-500 underline">
                                    {formatAmount(
                                        toEGLDD(
                                            VE_ASH_DECIMALS,
                                            veAvailable || 0
                                        ).toNumber()
                                    )}{" "}
                                    ve
                                </span>
                            </span>
                        </OnboardTooltip>
                    ) : (
                        <>&nbsp;</>
                    )}
                </div>
            </div>
            <div className="hidden md:block border-t border-dashed border-stake-gray-500 relative">
                <div className="absolute -right-1 -top-4.5 text-ash-gray-500 text-2xl">
                    &rsaquo;
                </div>
            </div>
            <div className={`${isOwner ? "" : "mb-6"}`}>
                <BoostBarValue
                    value={currentBoost?.boost}
                    newVal={expectedBoost?.boost}
                    disabled={!isOwner}
                    veLine={isOwner}
                    topLabel
                    currentVe={toEGLDD(
                        VE_ASH_DECIMALS,
                        currentBoost?.veForBoost || 0
                    ).toNumber()}
                    expectedVe={toEGLDD(
                        VE_ASH_DECIMALS,
                        expectedBoost?.veForBoost || 0
                    ).toNumber()}
                    maxVe={toEGLDD(
                        VE_ASH_DECIMALS,
                        maxBoost?.veForBoost || 0
                    ).toNumber()}
                />
            </div>
        </div>
    );
};

const FarmRecordTransfer = ({
    farmToken,
    farmData,
}: {
    farmToken: FarmToken;
    farmData: FarmRecord;
}) => {
    const { currentFarmBoost, selfBoost } = useFarmBoostTransferState(
        farmToken,
        farmData
    );
    return (
        <FarmBoostRecord
            farmData={farmData}
            veConsume={new BigNumber(0)}
            currentBoost={currentFarmBoost}
            lpAmt={farmToken.lpAmt}
            booster={farmToken.attributes.booster}
            onSelfBoostTransferedToken={() => selfBoost()}
        />
    );
};

type FarmBoostInfoType = {
    farmData: FarmRecord;
};
const FarmBoostInfo = ({ farmData }: FarmBoostInfoType) => {
    const { pool, farm } = farmData;
    const [token1, token2] = pool?.tokens;
    const { encode } = useRouteModal("calc_boost");
    const boostFarmToken = useFarmBoost();
    const ownerTokens = useRecoilValue(
        farmOwnerTokensQuery(farmData.farm.farm_address)
    );
    const transferedTokens = useRecoilValue(
        farmTransferedTokensQuery(farmData.farm.farm_address)
    );

    const { currentFarmBoost, expectedFarmBoost, maxFarmBoost, availableVe } =
        useFarmBoostOwnerState(farmData);
    const lpAmt = useMemo(() => {
        return ownerTokens.reduce(
            (total, t) => total.plus(t.lpAmt),
            new BigNumber(0)
        );
    }, [ownerTokens]);

    return (
        <div>
            <div className="px-10 sm:px-16 pb-10 sm:pb-16">
                <div className="text-2xl font-bold text-white mb-6 sm:mb-8">
                    Boost Panel
                </div>
                <div className="flex items-center text-sm font-bold text-stake-gray-500">
                    <Avatar
                        src={token1.icon}
                        alt={token1.name}
                        className="w-5 h-5"
                    />
                    <Avatar
                        src={token2.icon}
                        alt={token2.name}
                        className="w-5 h-5 -ml-0.5 mr-2"
                    />
                    <div className="mr-2">
                        {token1.symbol}-{token2.symbol}
                    </div>
                    <ICChevronDown />
                </div>
                {ownerTokens.length > 0 && (
                    <>
                        <div className="mt-10 mb-36">
                            <FarmBoostRecord
                                farmData={farmData}
                                veConsume={
                                    expectedFarmBoost.veForBoost.minus(
                                        currentFarmBoost.veForBoost
                                    )
                                }
                                currentBoost={currentFarmBoost}
                                expectedBoost={expectedFarmBoost}
                                maxBoost={maxFarmBoost}
                                veAvailable={availableVe}
                                lpAmt={lpAmt}
                                booster={ownerTokens[0].attributes.booster}
                            />
                        </div>
                        <div className="flex sm:justify-end space-x-2">
                            <Link
                                href={{
                                    pathname: "/stake/gov/boost",
                                    query: {
                                        p: encode({
                                            farmAddress: farm.farm_address,
                                        }),
                                    },
                                }}
                            >
                                <a>
                                    <BaseButton className="h-12 w-12 sm:w-auto bg-ash-dark-400 px-1 sm:px-6 uppercase text-sm font-bold text-white">
                                        <ICEqualSquare className="text-white w-4.5 h-4.5" />
                                        <span className="hidden sm:inline ml-1">
                                            Calculate
                                        </span>
                                    </BaseButton>
                                </a>
                            </Link>

                            <GlowingButton
                                theme="pink"
                                className="h-12 w-full px-12 uppercase text-sm font-bold text-white"
                                wrapperClassName="grow sm:grow-0"
                                disabled={
                                    !ownerTokens.length ||
                                    expectedFarmBoost.boost <=
                                        currentFarmBoost.boost
                                }
                                onClick={() =>
                                    ownerTokens &&
                                    boostFarmToken(farm, ownerTokens, true)
                                }
                            >
                                <span className="mr-4">Confirm new boost</span>
                                <ICChevronRight className="w-2 h-auto" />
                            </GlowingButton>
                        </div>
                    </>
                )}
            </div>
            {transferedTokens.length > 0 && (
                <div className="bg-ash-dark-600 p-10 sm:p-16 space-y-5">
                    {transferedTokens.map((t) => (
                        <FarmRecordTransfer
                            key={t.tokenId}
                            farmData={farmData}
                            farmToken={t}
                        />
                    ))}
                </div>
            )}
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
            className={`bg-stake-dark-400 clip-corner-4 clip-corner-tl text-white flex flex-col overflow-hidden max-h-full w-screen max-w-[60rem] mx-auto`}
        >
            <div className="flex justify-end mb-3.5 p-4">
                <BaseModal.CloseBtn />
            </div>
            <div className="flex-grow overflow-auto">
                <FarmBoostInfo farmData={farmData} />
            </div>
        </BaseModal>
    );
}

export default FarmBoostInfoModal;
