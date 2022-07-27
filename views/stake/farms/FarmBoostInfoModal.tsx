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
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import FarmBoostTooltip from "./FarmBoostTooltip";

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
}) => {
    const [onboardingZeroVe, setOnboardedZeroVe] = useOnboarding(
        "farm_zero_available_ve"
    );
    const [onboardingTransferedToken, setOnboardedTransferedToken] =
        useOnboarding("farm_transfered_token_guide");
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
        return isOwner && veAvailable?.eq(0) && onboardingZeroVe;
    }, [isOwner, veAvailable, onboardingZeroVe]);
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
                </OnboardTooltip>
                <div className="text-right text-xs font-medium">
                    {isOwner ? (
                        <OnboardTooltip
                            disabled={isBoosting}
                            delayOpen={3000}
                            offset={30}
                            zIndex={999}
                            placement="bottom-end"
                            open={zeroVeTooltip}
                            onArrowClick={() => setOnboardedZeroVe(true)}
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
            booster={farmToken.attributes.booster}
            onSelfBoostTransferedToken={() => selfBoostHandle()}
            onboarding={onboarding}
        />
    );
};

type FarmBoostInfoType = {
    farmData: FarmRecord;
    onClose?: (event: any) => void;
};
const FarmBoostInfo = ({ farmData, onClose }: FarmBoostInfoType) => {
    const { pool, farm } = farmData;
    const [token1, token2] = pool?.tokens;
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
    return (
        <div>
            <div className="px-10 sm:px-16 text-2xl font-bold text-white mb-6 sm:mb-8">
                Boost Panel
            </div>
            <div className="relative">
                <div className="px-10 sm:px-16 pb-10 sm:pb-16">
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
                        {/* <ICChevronDown /> */}
                    </div>
                    {ownerTokens.length > 0 ? (
                        <>
                            <div className="mt-10 mb-36">
                                <FarmBoostRecord
                                    farmData={farmData}
                                    veConsume={
                                        expectedFarmBoost.boost >
                                        currentFarmBoost.boost
                                            ? expectedFarmBoost.veForBoost.minus(
                                                  currentFarmBoost.veForBoost
                                              )
                                            : new BigNumber(0)
                                    }
                                    currentBoost={currentFarmBoost}
                                    expectedBoost={expectedFarmBoost}
                                    maxBoost={maxFarmBoost}
                                    veAvailable={BigNumber.max(availableVe, 0)}
                                    lpAmt={lpAmt}
                                    booster={ownerTokens[0].attributes.booster}
                                    isBoosting={isBoosting}
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
                                            The estimated yield boost may be
                                            lower than the current yield boost.
                                        </>
                                    }
                                >
                                    <div>
                                        <GlowingButton
                                            theme="pink"
                                            className="h-12 w-full px-4 sm:px-12 uppercase text-sm font-bold text-white"
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
                        </>
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
                                        You&apos;ve not enter any farm yet
                                    </div>
                                    <div>
                                        Go{" "}
                                        <Link href="/stake/gov">
                                            <a onClick={onClose}>
                                                <span className="underline text-ash-cyan-500">
                                                    stake LP-Tokens
                                                </span>
                                            </a>
                                        </Link>{" "}
                                        now
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {transferedTokens.length > 0 && (
                    <div className="bg-ash-dark-600 p-10 sm:p-16 space-y-5">
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
            className={`bg-stake-dark-400 clip-corner-4 clip-corner-tl text-white flex flex-col overflow-hidden max-h-full w-screen max-w-[60rem] sm:mx-auto`}
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
