import { Transition } from "@headlessui/react";
import ImgMetalCardBg from "assets/images/metal-card-bg.png";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";
import ICGovBoost from "assets/svg/gov-boost.svg";
import ICMinus from "assets/svg/minus.svg";
import ICPlus from "assets/svg/plus.svg";
import { farmLoadingMapState, FarmRecord } from "atoms/farmsState";
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
import { ASH_TOKEN } from "const/tokens";
import { TRANSITIONS } from "const/transitions";
import { toEGLDD } from "helper/balance";
import { formatAmount } from "helper/number";
import useFarmClaimReward from "hooks/useFarmContract/useFarmClaimReward";
import { useScreenSize } from "hooks/useScreenSize";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import FarmBoostInfoModal from "./FarmBoostInfoModal";
import { ViewType } from "./FarmFilter";
import FarmListLayoutContainer from "./FarmListLayoutContainer";

type props = {
    farmData: FarmRecord;
    viewType: ViewType;
};
const Card = ({ children }: any) => {
    return (
        <div
            className="clip-corner-tr-[0.875rem] clip-corner-bevel relative mx-auto p-[1px] w-full"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, #5E6480 9.65%, #171A26 91.8%)",
            }}
        >
            <div
                className="absolute clip-corner-tr-[0.875rem] clip-corner-bevel inset-[1px] z-[-1] bg-stake-dark-400"
                // style={{
                //     backgroundImage:
                //         "linear-gradient(180deg, #31314E 0%, #1F2131 100%)",
                // }}
            ></div>

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
function FarmCard({ farmData, viewType }: props) {
    const { stakedData, farm, totalLiquidityValue, emissionAPR } = farmData;
    const [openStakeLP, setOpenStakeLP] = useState<boolean>(false);
    const [openUnstakeLP, setOpenUnstakeLP] = useState<boolean>(false);
    const [openBoostInfo, setOpenBoostInfo] = useState(false);
    const [mOpenFarm, setMOpenFarm] = useState(false);
    const screenSize = useScreenSize();
    const loadingMap = useRecoilValue(farmLoadingMapState);
    const { claimReward } = useFarmClaimReward();
    const [isExpand, setIsExpand] = useState(false);
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

    const rewardValue = useMemo(() => {
        return toEGLDD(ASH_TOKEN.decimals, totalRewardAmt).multipliedBy(
            tokenMap[ASH_TOKEN.identifier].price || 0
        );
    }, [totalRewardAmt, tokenMap]);

    const stakedLPValue = useMemo(() => {
        return new BigNumber(farmData.stakedData?.totalStakedLP || 0)
            .multipliedBy(farmData.totalLiquidityValue)
            .div(farmData.lpLockedAmt);
    }, [farmData]);

    const cardElement = (
        <div className="relative">
            <div
                className="absolute inset-[1px] bg-no-repeat z-[-1]"
                style={{
                    backgroundImage: `url(${ImgMetalCardBg.src})`,
                    backgroundSize: "54px",
                    backgroundPosition: `calc(100% - ${
                        screenSize.sm ? 40 : 24
                    }px) 70px`,
                }}
            ></div>
            <div className="text-white border border-transparent">
                <div className="px-6 sm:px-10 py-8">
                    <div className="flex items-start justify-between mt-0.5 -mr-3 mb-11">
                        <div className="overflow-hidden">
                            <div className="text-stake-gray-500 text-xs mb-2.5">
                                Stake LP
                            </div>
                            <div
                                className={`font-bold text-white truncate ${
                                    is2Pool ? "text-2xl" : "text-lg"
                                }`}
                            >
                                {farmData.pool.tokens
                                    .map((t) => t.symbol)
                                    .join(is2Pool ? " & " : "/")}
                            </div>
                        </div>
                        <div
                            className={`shrink-0 flex flex-wrap justify-center ${
                                is2Pool ? "" : "-mr-2 max-w-[4.5rem]"
                            }`}
                        >
                            {farmData.pool.tokens.map((t, i) => {
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
                    <div className="mb-12 flex justify-between">
                        <div>
                            <CardTooltip
                                strategy="fixed"
                                content={
                                    <div>
                                        Emission Annual Percentage Rate. This
                                        summary is calculated by the ASH you
                                        have farmed every day by staking LP.
                                    </div>
                                }
                            >
                                <div className="inline-block text-stake-gray-500 text-xs font-bold underline mb-4">
                                    Emission APR
                                </div>
                            </CardTooltip>
                            <div className="text-lg font-bold text-ash-cyan-500">
                                {formatAmount(emissionAPR?.toNumber() || 0, {
                                    notation: "standard",
                                })}
                                %
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="mb-2.5">
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
                                className={`w-[120px] -mr-1 cursor-pointer`}
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
                            <CardTooltip
                                content={
                                    <div>Total ASH available to harvest.</div>
                                }
                            >
                                <div className="inline-block text-xs text-stake-gray-500 font-bold underline mb-2">
                                    {ASH_TOKEN.symbol} Farmed
                                </div>
                            </CardTooltip>
                            <div
                                className={`text-lg font-bold ${
                                    stakedData?.totalRewardAmt.gt(0)
                                        ? "text-white"
                                        : "text-stake-gray-500"
                                }`}
                            >
                                <TextAmt
                                    number={toEGLDD(
                                        ASH_TOKEN.decimals,
                                        totalRewardAmt
                                    )}
                                    decimalClassName={`${
                                        totalRewardAmt.gt(0)
                                            ? "text-stake-gray-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            {isExpand && (
                                <div className="mt-3">
                                    <EstimateInUSD number={rewardValue} />
                                </div>
                            )}
                        </div>
                        <GlowingButton
                            theme="cyan"
                            className={`clip-corner-1 clip-corner-br w-[7.25rem] h-14 text-sm font-bold`}
                            disabled={!stakedData?.totalRewardAmt.gt(0)}
                            onClick={() =>
                                stakedData?.totalRewardAmt.gt(0) &&
                                claimReward(farm).then(() =>
                                    setMOpenFarm(false)
                                )
                            }
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
                                        onClick={() => setOpenStakeLP(true)}
                                    >
                                        <ICPlus className="w-3 h-auto text-ash-cyan-500" />
                                    </button>
                                </div>
                            ) : (
                                <GlowingButton
                                    theme="cyan"
                                    className={`clip-corner-1 clip-corner-br w-[7.25rem] h-14 text-sm font-bold underline`}
                                    onClick={() => setOpenStakeLP(true)}
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
            disabled={!stakedData?.totalRewardAmt.gt(0)}
            onClick={() =>
                stakedData?.totalRewardAmt.gt(0) && claimReward(farm)
            }
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
                onClick={() => setOpenStakeLP(true)}
            >
                <ICPlus className="w-3 h-auto text-ash-cyan-500" />
            </button>
        </div>
    ) : (
        <GlowingButton
            theme="cyan"
            className={`clip-corner-1 clip-corner-br h-10 lg:h-12 w-full font-bold underline text-xs`}
            onClick={() => setOpenStakeLP(true)}
        >
            Stake LP
        </GlowingButton>
    );

    return (
        <>
            {viewType === ViewType.Card && (
                <div className="relative">
                    <Card>{cardElement}</Card>
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
                                    {farmData.pool.tokens.map((t, i) => {
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
                                    {farmData.pool.tokens.map(t => <div key={t.identifier}>{t.symbol}</div>)}
                                </div>
                            </div>
                            {/* emission APR */}
                            <div className="text-ash-cyan-500 text-xs lg:text-lg font-bold">
                                {formatAmount(emissionAPR?.toNumber() || 0, {
                                    notation: "standard",
                                })}
                                %
                            </div>
                            <div className="hidden xs:block pr-2.5 sm:pr-3.5 text-right text-white text-xs lg:text-lg font-bold">
                                <div
                                    className="cursor-pointer"
                                    onClick={(e) => {e.stopPropagation(); setOpenBoostInfo(true)}}
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
                                        <TextAmt number={rewardValue} />
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
        </>
    );
}

export default FarmCard;
