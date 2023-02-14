import { useTrackTransactionStatus } from "@elrondnetwork/dapp-core/hooks";
import { Transition } from "@headlessui/react";
import ImgASHSleep from "assets/images/ash-sleep.png";
import ICChevronRight from "assets/svg/chevron-right.svg";
import ICEqualSquare from "assets/svg/equal-square.svg";
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
import BaseModal, { BaseModalType } from "components/BaseModal";
import AdvanceBoostBar from "components/BoostBar/AdvanceBoostBar";
import GlowingButton from "components/GlowingButton";
import CardTooltip from "components/Tooltip/CardTooltip";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import pools from "const/pool";
import { VE_ASH_DECIMALS } from "const/tokens";
import { TRANSITIONS } from "const/transitions";
import { toEGLDD } from "helper/balance";
import { formatAmount } from "helper/number";
import {
    useFarmBoostOwnerState,
    useFarmBoostTransferState,
} from "hooks/useFarmBoostState";
import useFarmBoost from "hooks/useFarmContract/useFarmBoost";
import { useOnboarding } from "hooks/useOnboarding";
import useRouteModal from "hooks/useRouteModal";
import { useScreenSize } from "hooks/useScreenSize";
import { FarmBoostInfo } from "interface/farm";
import Image from "components/Image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import FarmBoostTooltip from "./FarmBoostTooltip";
import ICArrowBarRight from "assets/svg/arrow-bar-right.svg";
import ICChevronVRight from "assets/svg/chevron-v-right.svg";
import ICCloseV from "assets/svg/close-v.svg";
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
    isBoosting,
    onboarding,
    withHexIcon,
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
    isBoosting?: boolean;
    onboarding?: boolean;
    withHexIcon?: boolean;
}) => {
    const [onboardingZeroVe, setOnboardedZeroVe] = useOnboarding(
        "farm_zero_available_ve"
    );
    const [onboardingTransferedToken, setOnboardedTransferedToken] =
        useOnboarding("farm_transfered_token_guide");
    const accAddress = useRecoilValue(accAddressState);
    const farm = farmData.farm;
    const pool = useMemo(() => {
        return pools.find(
            (p) => p.lpToken.identifier === farm.farming_token_id
        );
    }, [farm]);
    const isOwner = useMemo(
        () => booster === accAddress,
        [booster, accAddress]
    );
    const zeroVeTooltip = useMemo(() => {
        return isOwner && veAvailable?.eq(0) && onboardingZeroVe;
    }, [isOwner, veAvailable, onboardingZeroVe]);
    const canBoost = useMemo(() => {
        return (
            expectedBoost &&
            currentBoost &&
            expectedBoost.boost > currentBoost.boost
        );
    }, [expectedBoost, currentBoost]);
    if (!pool) return null;

    return (
        <div className="flex sm:grid sm:grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)_2fr] items-center">
            {withHexIcon ? (
                <div className="relative mr-2">
                    <ICHexagonDuo
                        className={`w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16 stroke-transparent ${
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
            ) : (
                <div></div>
            )}
            <div className="hidden sm:block space-y-2">
                <div className="text-stake-gray-500 text-xs font-bold">
                    veASH
                </div>
                <OnboardTooltip
                    disabled={isBoosting || isOwner || !onboarding}
                    delayOpen={4000}
                    offset={30}
                    zIndex={999}
                    placement="bottom-start"
                    open={onboardingTransferedToken}
                    onArrowClick={() => setOnboardedTransferedToken(true)}
                    content={
                        <OnboardTooltip.Panel className="max-w-[18rem]">
                            <div className="px-5 my-3 text-xs font-bold text-white">
                                <div>
                                    This is{" "}
                                    <span className="text-stake-green-500">
                                        Transferred Token
                                    </span>{" "}
                                    that you have received from another wallet.
                                </div>
                                <div>
                                    This token(s) has been boosted by owner. You
                                    can{" "}
                                    <span className="text-stake-green-500">
                                        change the owner & booster
                                    </span>{" "}
                                    by hover on the token
                                </div>
                            </div>
                        </OnboardTooltip.Panel>
                    }
                >
                    <div className="relative">
                        <ICArrowBarRight
                            className="w-full h-[2.625rem] text-stake-dark-500"
                            preserveAspectRatio="xMaxYMid slice"
                        />
                        <div
                            className={`text-sm text-right font-bold h-[2.625rem] pl-4 pr-8 flex items-center justify-end absolute inset-0`}
                        >
                            <span
                                className={`${
                                    canBoost
                                        ? "text-ash-pink-500"
                                        : "text-ash-purple-500"
                                }`}
                            >
                                {formatAmount(
                                    toEGLDD(
                                        VE_ASH_DECIMALS,
                                        BigNumber.max(veConsume, 0)
                                    ).toNumber(),
                                    { notation: "standard" }
                                )}
                            </span>
                            <span className="text-ash-gray-600">&nbsp;ve</span>
                        </div>
                    </div>
                </OnboardTooltip>
                <div className="text-right text-xs font-medium">&nbsp;</div>
            </div>
            <div className="hidden sm:flex justify-center w-16 lg:w-20">
                {isOwner ? (
                    canBoost ? (
                        <>
                            <ICChevronVRight className="text-stake-gray-500" />
                            <ICChevronVRight className="text-ash-pink-500" />
                        </>
                    ) : (
                        <>
                            <ICCloseV className="text-ash-purple-500 mr-1" />
                            <ICCloseV className="text-ash-purple-500" />
                        </>
                    )
                ) : (
                    <>
                        <ICChevronVRight className="text-stake-gray-500" />
                        <ICChevronVRight className="text-stake-gray-500" />
                    </>
                )}
            </div>
            <div className={`grow ${isOwner ? "" : "mb-6"}`}>
                <AdvanceBoostBar
                    farmAddress={farmData.farm.farm_address}
                    onboardMaxBoost={isOwner}
                    max={maxBoost?.boost}
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
                    withOnboarding={isOwner}
                />
            </div>
        </div>
    );
};

const FarmRecordTransfer = ({
    farmToken,
    farmData,
    onBoosting,
    onboarding,
}: {
    farmToken: FarmToken;
    farmData: FarmRecord;
    onBoosting?: (val: boolean) => void;
    onboarding?: boolean;
}) => {
    const [boostId, setBoostId] = useState<string | null>(null);
    const { isPending } = useTrackTransactionStatus({
        transactionId: boostId,
    });
    const { currentFarmBoost, maxFarmBoost, selfBoost } =
        useFarmBoostTransferState(farmToken, farmData);
    const selfBoostHandle = useCallback(async () => {
        const { sessionId, error } = await selfBoost();
        setBoostId(sessionId);
    }, [selfBoost]);
    const boosting = useMemo(
        () => !!(boostId && isPending),
        [boostId, isPending]
    );
    useEffect(() => onBoosting?.(boosting), [onBoosting, boosting]);
    return (
        <FarmBoostRecord
            farmData={farmData}
            veConsume={new BigNumber(0)}
            currentBoost={currentFarmBoost}
            maxBoost={maxFarmBoost}
            lpAmt={farmToken.lpAmt}
            booster={farmToken.attributes.booster.bech32()}
            onSelfBoostTransferedToken={() => selfBoostHandle()}
            onboarding={onboarding}
            withHexIcon
        />
    );
};

type FarmBoostInfoType = {
    farmData: FarmRecord;
    onClose?: (event: any) => void;
};
const FarmBoostInfo = ({ farmData, onClose }: FarmBoostInfoType) => {
    const { pool, farm } = farmData;
    const [boostId, setBoostId] = useState<string | null>(null);
    const [isSelfBoostTToken, setIsSelfBoostTToken] = useState(false);
    const { isPending } = useTrackTransactionStatus({
        transactionId: boostId,
    });
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
    const boostOwnerFarmToken = useCallback(async () => {
        const { sessionId, error } = await boostFarmToken(farm, ownerTokens);
        setBoostId(sessionId);
    }, [boostFarmToken, farm, ownerTokens]);
    const isBoosting = useMemo(
        () => !!(boostId && isPending) || isSelfBoostTToken,
        [boostId, isPending, isSelfBoostTToken]
    );
    const veConsume = useMemo(() => {
        return expectedFarmBoost.boost > currentFarmBoost.boost
            ? expectedFarmBoost.veForBoost.minus(currentFarmBoost.veForBoost)
            : new BigNumber(0);
    }, [expectedFarmBoost, currentFarmBoost]);
    return (
        <div>
            <div className="relative">
                <div className="px-10 lg:px-16 pb-10 sm:pb-16">
                    {ownerTokens.length > 0 ? (
                        <div>
                            <div className="md:flex md:space-x-7.5">
                                <div className="grow">
                                    <div className="text-2xl font-bold text-white mb-6 sm:mb-8">
                                        Boost Panel
                                    </div>
                                    <div className="flex items-center text-sm font-bold text-stake-gray-500">
                                        {pool.tokens.map((t) => {
                                            return (
                                                <Avatar
                                                    key={t.identifier}
                                                    src={t.logoURI}
                                                    alt={t.name}
                                                    className="w-5 h-5 -ml-0.5 first:ml-0"
                                                />
                                            );
                                        })}
                                        <div className="mx-2">
                                            {pool.tokens
                                                .map((t) => t.symbol)
                                                .join("-")}
                                        </div>
                                        {/* <ICChevronDown /> */}
                                    </div>
                                    <div className="mt-10 mb-14 md:mb-36">
                                        <FarmBoostRecord
                                            farmData={farmData}
                                            veConsume={veConsume}
                                            currentBoost={currentFarmBoost}
                                            expectedBoost={expectedFarmBoost}
                                            maxBoost={maxFarmBoost}
                                            veAvailable={BigNumber.max(
                                                availableVe,
                                                0
                                            )}
                                            lpAmt={lpAmt}
                                            booster={ownerTokens[0].attributes.booster.bech32()}
                                            isBoosting={isBoosting}
                                            withHexIcon={
                                                transferedTokens.length > 0
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="shrink-0 w-full md:w-60 lg:w-72 p-6 md:p-10 bg-ash-dark-400/30">
                                    <div className="text-lg font-bold text-white mb-8 sm:mb-16">
                                        Estimated Boost
                                    </div>
                                    <div className="space-y-9">
                                        <div>
                                            <div className="text-stake-gray-500 text-xs font-semibold underline mb-2">
                                                veASH use for boost
                                            </div>
                                            <div className="text-white text-base md:text-lg font-bold">
                                                {formatAmount(
                                                    toEGLDD(
                                                        VE_ASH_DECIMALS,
                                                        BigNumber.max(
                                                            veConsume,
                                                            0
                                                        )
                                                    ).toNumber(),
                                                    { notation: "standard" }
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-stake-gray-500 text-xs font-semibold underline mb-2">
                                                New boost
                                            </div>
                                            {veConsume.gt(0) ? (
                                                <div className="text-ash-pink-500 text-base md:text-lg font-bold">
                                                    x
                                                    {formatAmount(
                                                        expectedFarmBoost.boost
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-ash-purple-500 text-base md:text-lg font-bold">
                                                    No veASH to boost
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-stake-gray-500 text-xs font-semibold underline mb-2">
                                                Max boost possible
                                            </div>
                                            <div className="text-white text-base md:text-lg font-bold">
                                                x{maxFarmBoost.boost.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:flex justify-between items-center mt-14">
                                <div className="text-xs mb-4 md:mb-0 md:mr-10">
                                    <span className="text-stake-gray-500 font-semibold">
                                        You can boost all of your farms just by
                                        one click, visit{" "}
                                    </span>
                                    <Link href="/stake/gov/boost">
                                        <a>
                                            <span className="text-pink-600 font-bold underline">
                                                Governance Yield Boosting
                                            </span>
                                        </a>
                                    </Link>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Link
                                        href={{
                                            query: {
                                                p: encode({
                                                    farmAddress:
                                                        farm.farm_address,
                                                }),
                                            },
                                        }}
                                        scroll={false}
                                        replace
                                    >
                                        <a>
                                            <BaseButton className="h-12 w-12 sm:w-auto bg-ash-dark-400 px-1 sm:px-6 uppercase text-sm font-bold text-white">
                                                <ICEqualSquare className="text-white w-4.5 h-4.5" />
                                                <span className="hidden sm:inline ml-1">
                                                    Calculator
                                                </span>
                                            </BaseButton>
                                        </a>
                                    </Link>
                                    <CardTooltip
                                        disabled={
                                            ownerTokens.length > 0 &&
                                            expectedFarmBoost.boost >
                                                currentFarmBoost.boost
                                        }
                                        content={
                                            <>
                                                The estimated yield boost is
                                                lower than the current yield
                                                boost.
                                            </>
                                        }
                                    >
                                        <div className="shrink-0 grow md:w-60 lg:w-72">
                                            <GlowingButton
                                                theme="pink"
                                                className="h-12 w-full px-4 uppercase text-sm font-bold text-white"
                                                wrapperClassName="grow sm:grow-0"
                                                disabled={
                                                    !ownerTokens.length ||
                                                    expectedFarmBoost.boost <=
                                                        currentFarmBoost.boost
                                                }
                                                onClick={() =>
                                                    ownerTokens &&
                                                    boostOwnerFarmToken()
                                                }
                                            >
                                                <span className="mr-4">
                                                    Confirm new boost
                                                </span>
                                                <ICChevronRight className="w-2 h-auto" />
                                            </GlowingButton>
                                        </div>
                                    </CardTooltip>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-20">
                            <div className="flex items-center justify-center">
                                <div className="w-32 lg:w-36">
                                    <Image
                                        src={ImgASHSleep}
                                        alt="ash sleep"
                                        layout="responsive"
                                        className="mix-blend-luminosity"
                                    />
                                </div>
                                <div className="text-sm lg:text-lg font-bold text-stake-gray-500">
                                    <div>
                                        You&apos;ve not entered this farm yet
                                    </div>
                                    <div>
                                        Go{" "}
                                        <a onClick={onClose}>
                                            <span className="underline text-ash-cyan-500">
                                                stake LP-Tokens
                                            </span>
                                        </a>{" "}
                                        now
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {transferedTokens.length > 0 && (
                    <div className="flex md:space-x-7.5 bg-ash-dark-600 p-10 lg:p-16 space-y-5">
                        <div className="grow">
                            {transferedTokens.map((t, i) => (
                                <FarmRecordTransfer
                                    key={t.tokenId}
                                    farmData={farmData}
                                    farmToken={t}
                                    onBoosting={(isBoosting) =>
                                        setIsSelfBoostTToken(isBoosting)
                                    }
                                    onboarding={i === 0}
                                />
                            ))}
                        </div>
                        <div className="shrink-0 md:w-60 lg:w-72"></div>
                    </div>
                )}
                <Transition
                    show={isBoosting}
                    {...TRANSITIONS.fadeIn}
                    {...TRANSITIONS.fadeOut}
                >
                    <div className="absolute inset-0 z-modal flex items-center justify-center bg-stake-dark-400/90 backdrop-blur-[20px]">
                        <div className="w-[140px] h-[140px] rounded-full border-[20px] border-pink-600 border-t-ash-dark-600 animate-spin"></div>
                    </div>
                </Transition>
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
            className={`bg-stake-dark-400 clip-corner-4 clip-corner-tl text-white flex flex-col overflow-hidden max-h-full w-screen max-w-[70rem] sm:mx-auto`}
        >
            <div className="flex justify-end mb-3.5 p-4">
                <BaseModal.CloseBtn />
            </div>
            <div className="flex-grow overflow-auto">
                <FarmBoostInfo
                    farmData={farmData}
                    onClose={modalProps.onRequestClose}
                />
            </div>
        </BaseModal>
    );
}

export default FarmBoostInfoModal;
