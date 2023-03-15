import { Transition } from "@headlessui/react";
import ImgMetalCardBg from "assets/images/metal-card-bg.png";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";
import ICGovBoost from "assets/svg/gov-boost.svg";
import ICMinus from "assets/svg/minus.svg";
import ICPlus from "assets/svg/plus.svg";
import ICArrowRight from "assets/svg/arrow-right.svg";
import ICFarmAshFire from "assets/svg/farm-ash-fire.svg";
import { accIsLoggedInState } from "atoms/dappState";
import { farmLoadingMapState, FarmRecord } from "atoms/farmsState";
import { clickedHarvestModalState } from "atoms/harvestState";
import { clickedStakeModalState } from "atoms/stakeState";
import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal from "components/BaseModal";
import BoostBar from "components/BoostBar";
import GlowingButton from "components/GlowingButton";
import StakeLPModal from "components/StakeLPModal";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import UnstakeLPModal from "components/UnstakeLPModal";
import { ASH_TOKEN, TOKENS_MAP } from "const/tokens";
import { TRANSITIONS } from "const/transitions";
import { toEGLDD } from "helper/balance";
import { formatAmount } from "helper/number";
import { getTokenFromId } from "helper/token";
import useFarmClaimReward from "hooks/useFarmContract/useFarmClaimReward";
import { useScreenSize } from "hooks/useScreenSize";
import { memo, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import FarmBoostInfoModal from "./FarmBoostInfoModal";
import { ViewType } from "./FarmFilter";
import FarmListLayoutContainer from "./FarmListLayoutContainer";
import BaseTooltip from "components/BaseTooltip";
import FarmMultiRewardsTooltip from "./FarmMultiRewardsTooltip";
import FarmConfirmHarvestModal from "./FarmConfirmHarvestModal";
import { theme } from "tailwind.config";

type props = {
    farmData: FarmRecord;
    viewType: ViewType;
};
const Card = ({ children, isASHFarm }: {children: React.ReactNode, isASHFarm?: boolean}) => {
    return (
        <div className="relative">
            <div
                className="transition-all clip-corner-tr-[0.875rem] clip-corner-bevel absolute inset-0 mx-auto p-[1px] w-full"
                style={{
                    backgroundImage:
                        isASHFarm ? `linear-gradient(to bottom, ${theme.extend.colors.pink[600]} 0%, #171A26 40%)` : "linear-gradient(to bottom, #5E6480 9.65%, #171A26 91.8%)",
                }}
            >
                <div
                    className="absolute clip-corner-tr-[0.875rem] clip-corner-bevel inset-[1px] z-[-1] bg-stake-dark-400"
                    // style={{
                    //     backgroundImage:
                    //         "linear-gradient(180deg, #31314E 0%, #1F2131 100%)",
                    // }}
                ></div>
            </div>
            {children}
        </div>
    );
};
const EstimateInUSD = ({
    number,
    className,
}: {
    number: BigNumber.Value;
    className?: string;
}) => {
    return (
        <span className={className}>
            <span className="text-stake-gray-500">~ $</span>
            <TextAmt
                number={number}
                decimalClassName={`${
                    new BigNumber(number).gt(0) ? "text-stake-gray-500" : ""
                }`}
            />
        </span>
    );
};
const ASHRewardBreakdownTable = memo(function ASHRewardBreakdownTable({
    currentBoost,
    baseAPR,
}: {
    currentBoost: number;
    baseAPR: number;
}) {
    return (
        <table className="border border-ash-gray-600">
            <tbody>
                <tr>
                    <td className="px-4 py-1 border border-ash-gray-600 font-bold text-2xs sm:text-xs text-stake-gray-500">
                        Current <br /> ASH reward
                    </td>
                    <td className="px-4 py-1 border border-ash-gray-600 font-bold text-ash-purple-500">
                        <span className="text-sm sm:text-lg underline">
                            {formatAmount(currentBoost * baseAPR)}
                        </span>
                        <span className="text-2xs">%</span>
                    </td>
                    <td className="px-4 py-1 border border-ash-gray-600 font-bold text-2xs sm:text-sm text-white">
                        <span>Boosted: </span>
                        <span className="inline-flex items-center text-pink-600">
                            x{formatAmount(currentBoost)}{" "}
                            <ICGovBoost className="w-3 h-auto -mt-1 ml-1" />
                        </span>
                    </td>
                </tr>
                <tr>
                    <td className="px-4 py-1 border border-ash-gray-600 font-bold text-2xs sm:text-xs text-stake-gray-500">
                        Max reward <br /> can reach
                    </td>
                    <td className="px-4 py-1 border border-ash-gray-600 font-bold text-ash-purple-500">
                        <span className="text-sm sm:text-lg underline">
                            {formatAmount(2.5 * baseAPR)}
                        </span>
                        <span className="text-2xs">%</span>
                    </td>
                    <td className="px-4 py-1 border border-ash-gray-600 font-bold text-2xs sm:text-xs text-white">
                        <span>When boost: </span>
                        <span className="inline-flex items-center">
                            x2.5{" "}
                            <ICGovBoost className="w-2.5 h-auto -mt-1 ml-1" />
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    );
});
const FarmAPRBreakdown = ({
    farmData,
    onClose,
}: {
    farmData: FarmRecord;
    onClose: () => void;
}) => {
    const {
        ashBaseAPR,
        tradingAPR,
        tokensAPR,
        totalAPRMin,
        totalAPRMax,
        stakedData,
    } = farmData;
    const boost = useMemo(() => farmData.stakedData?.yieldBoost, [farmData]);
    return (
        <div className="colored-drop-shadow-md colored-drop-shadow-black/50">
            <div className="clip-corner-4 clip-corner-br bg-ash-dark-600 p-[1px] ">
                <div className="clip-corner-4 clip-corner-br bg-ash-dark-400 px-7 pt-8 pb-4">
                    <div className="mb-6 font-bold text-xs text-stake-gray-500">
                        Total APR = Token rewards + Trading APR
                    </div>
                    <div className="flex flex-col space-y-4">
                        <div>
                            <div className="flex justify-between items-center">
                                {stakedData ? (
                                    <span className="font-bold text-sm text-ash-purple-500">
                                        <BaseTooltip
                                            placement="bottom"
                                            content={
                                                <div
                                                    className={`max-w-[25rem] sm:max-w-[28rem] clip-corner-4 clip-corner-bl bg-clip-border p-[1px] backdrop-blur-[30px] transition-all overflow-hidden`}
                                                >
                                                    <div className="clip-corner-4 clip-corner-br p-7 bg-ash-dark-600/50 backdrop-blur-[30px] text-stake-gray-500 font-bold text-xs sm:text-sm break-words">
                                                        <ASHRewardBreakdownTable
                                                            baseAPR={ashBaseAPR}
                                                            currentBoost={
                                                                stakedData.yieldBoost
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <span className="underline">
                                                {formatAmount(
                                                    stakedData.yieldBoost *
                                                        ashBaseAPR
                                                )}
                                            </span>
                                        </BaseTooltip>
                                        <span className="text-2xs">%</span>
                                    </span>
                                ) : (
                                    <div className="flex items-center space-x-1.5 font-bold text-sm text-ash-purple-500">
                                        <span>
                                            <span className="underline">
                                                {formatAmount(ashBaseAPR)}
                                            </span>
                                            <span className="text-2xs">%</span>
                                        </span>
                                        <ICArrowRight className="w-3 h-auto" />
                                        <span>
                                            <span className="underline">
                                                {formatAmount(ashBaseAPR * 2.5)}
                                            </span>
                                            <span className="text-2xs">%</span>
                                        </span>
                                    </div>
                                )}
                                <div className="font-bold text-xs text-stake-gray-500 underline">
                                    ASH reward
                                </div>
                            </div>
                        </div>
                        {tokensAPR.map((t) => {
                            const token = TOKENS_MAP[t.tokenId];
                            return (
                                <div
                                    key={t.tokenId}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center font-bold text-sm text-ash-purple-500">
                                        <span>
                                            <span className="underline">
                                                {formatAmount(t.apr)}
                                            </span>
                                            <span className="text-2xs">%</span>
                                        </span>
                                    </div>
                                    <div className="font-bold text-xs text-stake-gray-500 underline">
                                        {token?.symbol} incentive
                                    </div>
                                </div>
                            );
                        })}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center font-bold text-sm text-yellow-600">
                                <span>
                                    <span className="underline">
                                        {formatAmount(tradingAPR)}
                                    </span>
                                    <span className="text-2xs">%</span>
                                </span>
                            </div>
                            <div className="font-bold text-xs text-stake-gray-500 underline">
                                Trading APR
                            </div>
                        </div>
                        <div className="border-t border-ash-cyan-500"></div>
                        <div className="flex justify-between items-center">
                            {stakedData ? (
                                <span className="font-bold text-sm text-ash-cyan-500">
                                    <span className="underline">
                                        {formatAmount(stakedData.totalAPR)}
                                    </span>
                                    <span className="text-2xs">%</span>
                                </span>
                            ) : (
                                <div className="flex items-center space-x-1.5 font-bold text-sm text-ash-cyan-500">
                                    <span>
                                        <span className="underline">
                                            {formatAmount(totalAPRMin)}
                                        </span>
                                        <span className="text-2xs">%</span>
                                    </span>
                                    <ICArrowRight className="w-3 h-auto" />
                                    <span>
                                        <span className="underline">
                                            {formatAmount(totalAPRMax)}
                                        </span>
                                        <span className="text-2xs">%</span>
                                    </span>
                                </div>
                            )}

                            <div className="font-bold text-sm text-white underline">
                                Total APR
                            </div>
                        </div>
                    </div>
                    <div className="mt-14 -mb-1 flex justify-center">
                        <button className="p-1" onClick={onClose}>
                            <ICChevronUp className="w-2 h-auto text-ash-cyan-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
function FarmCard({ farmData, viewType }: props) {
    const { stakedData, farm, totalLiquidityValue, totalAPRMin, totalAPRMax } =
        farmData;
    const [openStakeLP, setOpenStakeLP] = useState<boolean>(false);
    const [openUnstakeLP, setOpenUnstakeLP] = useState<boolean>(false);
    const [openBoostInfo, setOpenBoostInfo] = useState(false);
    const [openHarvestInfo, setOpenHarvestInfo] = useState(false);
    const [mOpenFarm, setMOpenFarm] = useState(false);
    const screenSize = useScreenSize();
    const loadingMap = useRecoilValue(farmLoadingMapState);
    const {
        claimReward,
        trackingData: { isSigned: isSignedHarvest },
    } = useFarmClaimReward(true);
    const [isExpand, setIsExpand] = useState(false);
    const [isOpenAPRBreakdown, setIsOpenAPRBreakdown] = useState(false);
    const tokenMap = useRecoilValue(tokenMapState);
    const stakedLPAmt = useMemo(() => {
        if (!stakedData?.totalStakedLP || stakedData?.totalStakedLP.eq(0))
            return new BigNumber(0);
        const bal = toEGLDD(farm.farm_token_decimal, stakedData.totalStakedLP);
        return bal;
    }, [farm, stakedData]);
    const totalRewardAmt = useMemo(() => {
        return stakedData?.totalRewardAmt || new BigNumber(0);
    }, [stakedData]);
    const loggedIn = useRecoilValue(accIsLoggedInState);
    const [isClickedHarvestButton, setIsClickedHarvestButton] = useRecoilState(
        clickedHarvestModalState
    );
    const [isClickedStakeButton, setIsClickedStakeButton] = useRecoilState(
        clickedStakeModalState
    );
    const is2Pool = useMemo(
        () => farmData.pool.tokens.length === 2,
        [farmData.pool.tokens.length]
    );

    useEffect(() => {
        if (!screenSize.isMobile) {
            setMOpenFarm(false);
        } else {
            setIsExpand(false);
        }
    }, [screenSize.isMobile]);

    useEffect(() => {
        if (window && openStakeLP && loggedIn) {
            let dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: "click_stake_lp",
            });
        }
    }, [openStakeLP]);
    useEffect(() => {
        if (window && openUnstakeLP && loggedIn) {
            let dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: "click_unstake_lp",
            });
        }
    }, [openUnstakeLP]);

    useEffect(() => {
        if (isSignedHarvest) {
            setOpenHarvestInfo(false);
        }
    }, [isSignedHarvest]);

    const totalRewardsValue = useMemo(() => {
        return (
            stakedData?.rewards.reduce(
                (s, r) =>
                    s.plus(
                        r.egld.multipliedBy(
                            tokenMap[r.token.identifier]?.price || 0
                        )
                    ),
                new BigNumber(0)
            ) || new BigNumber(0)
        );
    }, [tokenMap, stakedData]);

    const stakedLPValue = useMemo(() => {
        return new BigNumber(farmData.stakedData?.totalStakedLP || 0)
            .multipliedBy(farmData.totalLiquidityValue)
            .div(farmData.lpLockedAmt);
    }, [farmData]);

    const canHarvest = useMemo(() => {
        return (
            stakedData?.totalRewardAmt.gt(0) ||
            stakedData?.rewards.some((r) => r.greaterThan(0))
        );
    }, [stakedData]);

    const isASHFarm = useMemo(() => {
        return farmData.ashPerSec.gt(0);
    }, [farmData.ashPerSec]);

    const cardElement = (
        <div className="relative">
            {isASHFarm && (
                <ICFarmAshFire
                    className={`absolute -top-3.5 right-0 h-auto text-pink-600 colored-drop-shadow-sm colored-drop-shadow-pink-600 transition ${
                        !loadingMap[farmData.farm.farm_address]
                            ? "opacity-100"
                            : "opacity-0"
                    }`}
                />
            )}
            <div
                className="absolute inset-[1px] bg-no-repeat"
                style={{
                    backgroundImage: `url(${ImgMetalCardBg.src})`,
                    backgroundSize: "54px",
                    backgroundPosition: `calc(100% - ${
                        screenSize.sm ? 40 : 24
                    }px) 70px`,
                }}
            ></div>

            <div className="relative text-white border border-transparent">
                <div className="px-6 sm:px-10 py-8">
                    <div className="flex items-start justify-between mt-0.5 -mr-3 mb-11">
                        <div className="overflow-hidden">
                            <div className="text-stake-gray-500 font-medium text-xs mb-2.5">
                                {isASHFarm ? <span className="text-pink-600">ASH Farm</span> : <span>Stake LP</span>}
                            </div>
                            <div
                                className={`font-bold text-white truncate ${
                                    is2Pool ? "text-2xl" : "text-lg"
                                }`}
                            >
                                {farmData.pool.tokens
                                    .map(
                                        (t) =>
                                            getTokenFromId(t.identifier).symbol
                                    )
                                    .join(is2Pool ? " & " : "/")}
                            </div>
                        </div>
                        <div
                            className={`shrink-0 flex flex-wrap justify-center ${
                                is2Pool ? "" : "-mr-2 max-w-[4.5rem]"
                            }`}
                        >
                            {farmData.pool.tokens.map((_t, i) => {
                                const t = getTokenFromId(_t.identifier);
                                return (
                                    <Avatar
                                        key={t.identifier}
                                        src={t.logoURI}
                                        alt={t.symbol}
                                        className={`${
                                            is2Pool
                                                ? "w-[3.25rem] h-[3.25rem]"
                                                : "w-9 h-9"
                                        } ${
                                            i === 1
                                                ? is2Pool
                                                    ? "-ml-2.5"
                                                    : "-ml-1.5"
                                                : ""
                                        } ${i === 2 ? "-mt-2.5" : ""} ${
                                            i > 2 && "hidden"
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <Transition
                        show={isOpenAPRBreakdown}
                        enter="transition duration-500"
                        enterFrom="-translate-y-1/3 opacity-0"
                        enterTo="translate-y-0 opacity-100"
                        leave="transition duration-300"
                        leaveFrom="translate-y-0 opacity-100"
                        leaveTo="-translate-y-1/3 opacity-0"
                    >
                        <div className="-mx-4 mb-10">
                            <FarmAPRBreakdown
                                farmData={farmData}
                                onClose={() => setIsOpenAPRBreakdown(false)}
                            />
                        </div>
                    </Transition>
                    <div className="mb-12 flex justify-between">
                        <Transition
                            show={!isOpenAPRBreakdown}
                            {...TRANSITIONS.fadeIn}
                            {...TRANSITIONS.fadeOut}
                            enter="duration-300 delay-300"
                            className="flex flex-col justify-between"
                        >
                            <div className="inline-flex items-center mb-2.5">
                                <CardTooltip
                                    strategy="fixed"
                                    content={
                                        <div>
                                            Total APR = Token rewards + Trading
                                            APR
                                        </div>
                                    }
                                >
                                    <span className="inline-block text-stake-gray-500 text-xs font-bold underline mr-2">
                                        Total APR
                                    </span>
                                </CardTooltip>

                                <button
                                    onClick={() => setIsOpenAPRBreakdown(true)}
                                >
                                    <ICChevronDown className="text-ash-cyan-500" />
                                </button>
                            </div>

                            <div className="h-8 px-2.5 space-x-1.5 border border-black bg-stake-gray-500/10 flex items-center text-sm font-bold text-ash-cyan-500">
                                {stakedData ? (
                                    <div>
                                        <span className="underline">
                                            {formatAmount(stakedData.totalAPR)}
                                        </span>
                                        <span className="text-2xs">%</span>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <span className="underline">
                                                {formatAmount(totalAPRMin)}
                                            </span>
                                            <span className="text-2xs">%</span>
                                        </div>
                                        <ICArrowRight className="w-3 h-auto" />
                                        <div>
                                            <span className="underline">
                                                {formatAmount(totalAPRMax)}
                                            </span>
                                            <span className="text-2xs">%</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Transition>
                        <div
                            className={`transition-all flex flex-col items-end ${
                                isOpenAPRBreakdown && "w-full"
                            }`}
                        >
                            <div
                                className={`transition-all mb-2.5 w-full relative ${
                                    isOpenAPRBreakdown
                                        ? "text-left"
                                        : "text-right"
                                }`}
                            >
                                <CardTooltip
                                    zIndex={10}
                                    content={
                                        <div>
                                            <span>
                                                You can boost up to 2.5 times by{" "}
                                            </span>
                                            <span className="text-stake-green-500">
                                                staking ASH
                                            </span>
                                        </div>
                                    }
                                >
                                    <span
                                        className={`underline text-xs font-bold text-stake-gray-500`}
                                    >
                                        Farm Boost
                                    </span>
                                </CardTooltip>
                            </div>
                            <div
                                className={`transition-all duration-500 ease-in-out -mr-1 cursor-pointer ${
                                    isOpenAPRBreakdown ? "w-full" : "w-[120px]"
                                }`}
                                onClick={() => setOpenBoostInfo(true)}
                            >
                                <BoostBar
                                    height={32}
                                    value={farmData.stakedData?.yieldBoost || 1}
                                >
                                    <div className="px-4 h-full flex items-center justify-end text-lg font-bold text-stake-gray-500">
                                        <span>x</span>
                                        <span className="text-white">
                                            {formatAmount(
                                                farmData.stakedData
                                                    ?.yieldBoost || 1
                                            )}
                                        </span>
                                        <ICGovBoost className="w-3.5 h-3.5 inline-block -mt-0.5 ml-1" />
                                    </div>
                                </BoostBar>
                            </div>
                            {isExpand && (
                                <div className="flex flex-col items-end text-xs font-bold text-stake-gray-500 leading-tight mt-2">
                                    <div>Current / Max</div>
                                    <div>
                                        x
                                        {formatAmount(
                                            farmData.stakedData?.yieldBoost || 1
                                        )}{" "}
                                        / 2.5
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between mb-9">
                        <div>
                            <FarmMultiRewardsTooltip
                                rewards={stakedData?.rewards}
                            >
                                <div className="inline-flex text-xs text-stake-gray-500 font-bold underline mb-2">
                                    <span>Rewards</span>
                                    <div className="ml-1 flex items-center">
                                        {farmData.tokensAPR.map(_t => {
                                            const t = TOKENS_MAP[_t.tokenId];
                                            return <Avatar key={_t.tokenId} src={t?.logoURI} alt={t.name} className="w-3 h-3 -ml-0.5 first:ml-0"/>
                                        })}
                                    </div>
                                </div>
                            </FarmMultiRewardsTooltip>
                            <div
                                className={`text-lg font-bold ${
                                    canHarvest
                                        ? "text-white"
                                        : "text-stake-gray-500"
                                }`}
                            >
                                <TextAmt
                                    number={totalRewardsValue}
                                    prefix="$"
                                    decimalClassName={`${
                                        canHarvest ? "text-stake-gray-500" : ""
                                    }`}
                                />
                            </div>
                            {/* {isExpand && (
                                <div className="mt-3">
                                    <EstimateInUSD number={rewardValue} />
                                </div>
                            )} */}
                        </div>
                        <GlowingButton
                            theme="cyan"
                            className={`clip-corner-1 clip-corner-br w-[7.25rem] h-14 text-sm font-bold`}
                            disabled={!canHarvest}
                            onClick={() => {
                                setOpenHarvestInfo(true);
                                claimReward(farm).then(() =>
                                    setMOpenFarm(false)
                                );
                                setIsClickedHarvestButton(true);
                            }}
                        >
                            Harvest
                        </GlowingButton>
                    </div>
                    <div className="flex justify-between mb-11">
                        <div>
                            <CardTooltip
                                content={
                                    <div>
                                        Total amount of your staked LP-Token.
                                    </div>
                                }
                            >
                                <div className="inline-block text-xs text-stake-gray-500 font-bold underline mb-2">
                                    LP-Staked
                                </div>
                            </CardTooltip>
                            <div
                                className={`text-lg font-bold ${
                                    stakedLPAmt.eq(0)
                                        ? "text-stake-gray-500"
                                        : "text-white"
                                }`}
                            >
                                <TextAmt
                                    number={stakedLPAmt}
                                    decimalClassName={`${
                                        stakedLPAmt.eq(0)
                                            ? ""
                                            : "text-stake-gray-500"
                                    }`}
                                />
                            </div>
                            {isExpand && (
                                <div className="mt-3">
                                    <EstimateInUSD number={stakedLPValue} />
                                </div>
                            )}
                        </div>
                        <div>
                            {stakedData ? (
                                <div className="flex space-x-2 h-14 items-center">
                                    <button
                                        className="w-[3.375rem] h-[3.375rem] clip-corner-1 clip-corner-br bg-ash-dark-400 hover:bg-ash-dark-300 active:bg-ash-dark-600 transition-all flex items-center justify-center"
                                        onClick={() => setOpenUnstakeLP(true)}
                                    >
                                        <ICMinus className="w-3 h-auto text-yellow-600" />
                                    </button>
                                    <button
                                        className="w-[3.375rem] h-[3.375rem] clip-corner-1 clip-corner-bl bg-ash-dark-400 hover:bg-ash-dark-300 active:bg-ash-dark-600 transition-all flex items-center justify-center"
                                        onClick={() => {
                                            setOpenStakeLP(true);
                                            setIsClickedStakeButton(true);
                                        }}
                                    >
                                        <ICPlus className="w-3 h-auto text-ash-cyan-500" />
                                    </button>
                                </div>
                            ) : (
                                <GlowingButton
                                    theme="cyan"
                                    className={`clip-corner-1 clip-corner-br w-[7.25rem] h-14 text-sm font-bold underline`}
                                    onClick={() => {
                                        setOpenStakeLP(true);
                                        setIsClickedStakeButton(true);
                                    }}
                                >
                                    Stake LP
                                </GlowingButton>
                            )}
                        </div>
                    </div>
                    <div className="bg-stake-dark-500 flex items-center justify-between h-12 px-4">
                        <CardTooltip
                            content={
                                <div>
                                    Total value of staked LP-Token on ASHSWAP
                                    DEX
                                </div>
                            }
                        >
                            <div className="inline-block text-stake-gray-500 text-2xs mr-2 underline">
                                Total Liquidity
                            </div>
                        </CardTooltip>
                        <div className="text-stake-gray-500 text-sm">
                            $
                            <TextAmt
                                number={totalLiquidityValue}
                                options={{ notation: "standard" }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center text-white font-bold mt-6">
                        <span
                            className="flex items-center cursor-pointer"
                            onClick={() => setIsExpand((val) => !val)}
                        >
                            <span className="mr-1">Detail</span>
                            {isExpand ? <ICChevronUp /> : <ICChevronDown />}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    const harvestBtn = (
        <GlowingButton
            theme="cyan"
            className={`clip-corner-1 clip-corner-br h-10 lg:h-12 w-full font-bold text-xs`}
            disabled={!canHarvest}
            onClick={() => claimReward(farm)}
        >
            Harvest
        </GlowingButton>
    );
    const farmBtn = stakedData ? (
        <div className="flex justify-end space-x-2 py-0.5">
            <button
                className="w-10 lg:w-12 h-10 lg:h-12 clip-corner-1 clip-corner-br bg-ash-dark-400 hover:bg-ash-dark-300 active:bg-ash-dark-600 transition-all flex items-center justify-center"
                onClick={() => setOpenUnstakeLP(true)}
            >
                <ICMinus className="w-3 h-auto text-yellow-600" />
            </button>
            <button
                className="w-10 lg:w-12 h-10 lg:h-12 clip-corner-1 clip-corner-bl bg-ash-dark-400 hover:bg-ash-dark-300 active:bg-ash-dark-600 transition-all flex items-center justify-center"
                onClick={() => {
                    setOpenStakeLP(true);
                    setIsClickedStakeButton(true);
                }}
            >
                <ICPlus className="w-3 h-auto text-ash-cyan-500" />
            </button>
        </div>
    ) : (
        <GlowingButton
            theme="cyan"
            className={`clip-corner-1 clip-corner-br h-10 lg:h-12 w-full font-bold underline text-xs`}
            onClick={() => {
                setOpenStakeLP(true);
                setIsClickedStakeButton(true);
            }}
        >
            Stake LP
        </GlowingButton>
    );

    return (
        <>
            {viewType === ViewType.Card && (
                <div className="relative">
                    <Card isASHFarm={isASHFarm}>{cardElement}</Card>
                    <Transition
                        show={!!loadingMap[farmData.farm.farm_address]}
                        {...TRANSITIONS.fadeIn}
                        {...TRANSITIONS.fadeOut}
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-stake-dark-400/90 backdrop-blur-[20px]">
                            <div className="w-[140px] h-[140px] rounded-full border-[20px] border-ash-cyan-500 border-t-ash-dark-600 animate-spin"></div>
                        </div>
                    </Transition>
                </div>
            )}
            {viewType === ViewType.List && (
                <div className="relative">
                    <div
                        className={`px-4 lg:px-10 py-2 md:py-7.5 ${
                            screenSize.isMobile && "cursor-pointer"
                        }`}
                        onClick={() =>
                            screenSize.isMobile && setMOpenFarm(true)
                        }
                    >
                        <FarmListLayoutContainer>
                            <div className="flex items-center space-x-2 lg:space-x-6 overflow-hidden">
                                <div
                                    className={`shrink-0 flex flex-wrap justify-center w-8 md:w-12 lg:w-18`}
                                >
                                    {farmData.pool.tokens.map((_t, i) => {
                                        const t = getTokenFromId(_t.identifier);
                                        return (
                                            <Avatar
                                                key={t.identifier}
                                                src={t.logoURI}
                                                alt={t.symbol}
                                                className={`w-4 h-4 md:w-6 md:h-6 lg:w-9 lg:h-9 ${
                                                    i === 1
                                                        ? is2Pool
                                                            ? "-ml-2.5"
                                                            : "-ml-1.5"
                                                        : ""
                                                } ${i === 2 ? "-mt-2.5" : ""} ${
                                                    i > 2 && "hidden"
                                                }`}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex flex-col text-xs lg:text-lg font-bold md:space-y-2 leading-tight">
                                    {farmData.pool.tokens.map((_t) => {
                                        const t = getTokenFromId(_t.identifier);
                                        return (
                                            <div key={t.identifier}>
                                                {t.symbol}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* emission APR */}
                            <div className="text-ash-cyan-500 text-xs lg:text-lg font-bold">
                                {formatAmount(totalAPRMin, {
                                    notation: "standard",
                                })}
                                %
                            </div>
                            <div className="hidden xs:block pr-2.5 sm:pr-3.5 text-right text-white text-xs lg:text-lg font-bold">
                                <div
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenBoostInfo(true);
                                    }}
                                >
                                    <BoostBar
                                        height={screenSize?.isMobile ? 24 : 32}
                                        value={
                                            farmData?.stakedData?.yieldBoost ||
                                            1
                                        }
                                    >
                                        <div className="px-4 h-full flex items-center justify-end text-xs sm:text-lg font-bold text-stake-gray-500">
                                            <span className="text-2xs sm:text-lg">
                                                x
                                            </span>
                                            <span className="text-white">
                                                {formatAmount(
                                                    farmData?.stakedData
                                                        ?.yieldBoost || 1
                                                )}
                                            </span>
                                            <ICGovBoost className="w-3.5 h-3.5 inline-block -mt-0.5 ml-1" />
                                        </div>
                                    </BoostBar>
                                </div>
                            </div>
                            {/* ash Earned */}
                            <div
                                className={`bg-stake-dark-500 px-3.5 hidden md:flex flex-col items-end justify-center text-right text-white text-xs lg:text-lg font-bold ${
                                    isExpand
                                        ? "h-8 sm:h-14 lg:h-20"
                                        : "h-8 sm:h-10 lg:h-12"
                                }`}
                            >
                                <TextAmt
                                    number={toEGLDD(
                                        ASH_TOKEN.decimals,
                                        totalRewardAmt
                                    )}
                                    decimalClassName="text-stake-gray-500"
                                />
                                {isExpand && (
                                    <div className="mt-1 lg:mt-2.5 block text-xs lg:text-sm font-semibold text-stake-gray-500">
                                        <span className="font-normal">$</span>
                                        <TextAmt number={totalRewardsValue} />
                                    </div>
                                )}
                            </div>
                            {/* LP staked */}
                            <div
                                className={`bg-stake-dark-500 px-3.5 hidden md:flex flex-col items-end justify-center text-right text-white text-xs lg:text-lg font-bold ${
                                    isExpand
                                        ? "h-8 sm:h-14 lg:h-20"
                                        : "h-8 sm:h-10 lg:h-12"
                                }`}
                            >
                                <TextAmt
                                    number={stakedLPAmt}
                                    decimalClassName="text-stake-gray-500"
                                />
                                {isExpand && (
                                    <div className="mt-1 lg:mt-2.5 block text-xs lg:text-sm font-semibold text-stake-gray-500">
                                        <span className="font-normal">$</span>
                                        <TextAmt number={stakedLPValue} />
                                    </div>
                                )}
                            </div>
                            {/* Total liquidity */}
                            <div
                                className={`bg-stake-dark-500 px-3.5 flex items-center justify-end text-right text-white text-xs font-bold ${
                                    isExpand
                                        ? "h-8 sm:h-14 lg:h-20"
                                        : "h-8 sm:h-10 lg:h-12"
                                }`}
                            >
                                $
                                <TextAmt
                                    number={totalLiquidityValue}
                                    options={{ notation: "standard" }}
                                    decimalClassName="text-stake-gray-500"
                                />
                            </div>
                            <div className="hidden sm:flex items-center justify-end">
                                <button
                                    onClick={() => setIsExpand((val) => !val)}
                                >
                                    {isExpand ? (
                                        <ICChevronUp className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                                    ) : (
                                        <ICChevronDown className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                                    )}
                                </button>
                            </div>
                        </FarmListLayoutContainer>
                    </div>

                    {isExpand && (
                        <div className="px-4 lg:px-10 py-2 md:py-8 bg-stake-dark-450">
                            <FarmListLayoutContainer>
                                <div></div>
                                <div></div>
                                <div className="hidden xs:block pr-3.5">
                                    {isExpand && (
                                        <div className="flex flex-col items-end text-2xs md:text-xs font-bold text-stake-gray-500 leading-tight mt-2">
                                            <div>Current / Max</div>
                                            <div>
                                                x
                                                {formatAmount(
                                                    farmData.stakedData
                                                        ?.yieldBoost || 1
                                                )}{" "}
                                                / 2.5
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {screenSize.md ? (
                                    <>
                                        {harvestBtn}
                                        {farmBtn}
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-x-1">
                                        {harvestBtn}
                                        {farmBtn}
                                    </div>
                                )}

                                <div></div>
                            </FarmListLayoutContainer>
                        </div>
                    )}
                    <Transition
                        show={!!loadingMap[farmData.farm.farm_address]}
                        {...TRANSITIONS.fadeIn}
                        {...TRANSITIONS.fadeOut}
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-stake-dark-400/90 backdrop-blur-[20px]">
                            <div className="w-[20px] h-[20px] md:w-[40px] md:h-[40px] rounded-full border-[2px] md:border-[5px] border-ash-cyan-500 border-t-ash-dark-600 animate-spin"></div>
                        </div>
                    </Transition>
                </div>
            )}
            <BaseModal
                isOpen={mOpenFarm}
                onRequestClose={() => setMOpenFarm(false)}
                type="drawer_btt"
            >
                <Card>
                    <div>
                        <div className="pt-4 px-4 flex justify-end">
                            <BaseModal.CloseBtn />
                        </div>
                        <div className="pt-7">{cardElement}</div>
                    </div>
                </Card>
            </BaseModal>
            <StakeLPModal
                open={openStakeLP}
                onClose={() => setOpenStakeLP(false)}
                farmData={farmData}
            />

            <UnstakeLPModal
                open={openUnstakeLP}
                onClose={() => setOpenUnstakeLP(false)}
                farmData={farmData}
            />
            <FarmBoostInfoModal
                isOpen={openBoostInfo}
                onRequestClose={() => setOpenBoostInfo(false)}
                farmData={farmData}
            />
            {stakedData?.rewards && (
                <FarmConfirmHarvestModal
                    isOpen={openHarvestInfo}
                    onRequestClose={() => setOpenHarvestInfo(false)}
                    rewards={stakedData.rewards}
                />
            )}
        </>
    );
}

export default FarmCard;
