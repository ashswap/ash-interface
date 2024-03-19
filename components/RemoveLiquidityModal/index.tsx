import { Transition } from "@headlessui/react";
import * as Sentry from "@sentry/nextjs";
import { Slider } from "antd";
import ICChevronRight from "assets/svg/chevron-right.svg";
import ICHexagonDuo from "assets/svg/hexagon-duo.svg";
import { accIsInsufficientEGLDState } from "atoms/dappState";
import {
    LPBreakDownQuery,
    PoolsState,
    ashRawPoolV1ByAddressQuery,
    ashRawPoolV2ByAddressQuery,
} from "atoms/poolsState";
import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal from "components/BaseModal";
import GlowingButton from "components/GlowingButton";
import InputCurrency from "components/InputCurrency";
import Switch from "components/Switch";
import TextAmt from "components/TextAmt";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { blockTimeMs } from "const/dappConfig";
import CurveV2 from "helper/curveV2/swap";
import { Fraction } from "helper/fraction/fraction";
import { Percent } from "helper/fraction/percent";
import { formatAmount } from "helper/number";
import { calculateEstimatedWithdrawOneCoin } from "helper/stableswap/calculator/amounts";
import { getTokenFromId } from "helper/token";
import { TokenAmount } from "helper/token/tokenAmount";
import useInputNumberString from "hooks/useInputNumberString";
import useInterval from "hooks/useInterval";
import { useOnboarding } from "hooks/useOnboarding";
import usePoolRemoveLP from "hooks/usePoolContract/usePoolRemoveLP";
import usePoolRemoveLPOneCoin from "hooks/usePoolContract/usePoolRemoveLPOneCoin";
import { useScreenSize } from "hooks/useScreenSize";
import IPool, { EPoolType } from "interface/pool";
import { Unarray } from "interface/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { theme } from "tailwind.config";
import { useDebounce } from "use-debounce";
const onboardingWithdrawOneCoinTooltipContent = (
    <OnboardTooltip.Panel>
        <div className="p-4 font-bold text-sm text-white">
            Click on the <span className="text-stake-green-500">checkbox</span>{" "}
            to <span className="text-stake-green-500">select the token</span>{" "}
            that you want to{" "}
            <span className="text-stake-green-500">withdraw</span>.
        </div>
    </OnboardTooltip.Panel>
);
interface Props {
    open?: boolean;
    onClose?: () => void;
    poolData: Unarray<PoolsState["poolToDisplay"]>;
}
// hard-code slippage for removing LP ~ 5%
// TODO: use global slippage setting
const slippage = new Percent(5, 100);
const RemoveLPContent = ({ open, onClose, poolData }: Props) => {
    const { pool, liquidityData } = poolData;
    const { ownLiquidity } = liquidityData!;
    const [liquidityWei, setLiquidityWei] = useState<BigNumber>(
        new BigNumber(0)
    );
    const [isBalanced, setIsBalanced] = useState(true);
    const [selectedTokenIndex, setSelectedTokenIndex] = useState(-1);
    const liquidity = useMemo(
        () => new TokenAmount(poolData.pool.lpToken, liquidityWei).egld,
        [liquidityWei, poolData.pool.lpToken]
    );
    const [liquidityStr, setLiquidityStr] = useInputNumberString(
        liquidity,
        pool.lpToken.decimals
    );
    const [liquidityPercent, setLiquidityPercent] = useState<number>(0);
    const [outputValues, setOutputValues] = useState(
        pool.tokens.map((_t) => {
            const t = getTokenFromId(_t.identifier);
            return new TokenAmount(t, 0);
        })
    );
    const [maxOutputValues, setMaxOutputValues] = useState(
        pool.tokens.map((_t) => {
            const t = getTokenFromId(_t.identifier);
            return new TokenAmount(t, 0);
        })
    );
    const [liquidityDebounce] = useDebounce(liquidityWei, 500);
    const screenSize = useScreenSize();
    const insufficientEGLD = useRecoilValue(accIsInsufficientEGLDState);
    const { removeLP, trackingData } = usePoolRemoveLP(true);
    const { removeLPOneCoin, trackingData: removeOneCoinTrackingData } =
        usePoolRemoveLPOneCoin(true);
    const tokenMap = useRecoilValue(tokenMapState);

    const [onboardingWithdrawInput, setOnboardedWithdrawInput] = useOnboarding(
        "pool_withdraw_input"
    );
    const [onboardingWithdrawOneCoin, setOnboardedWithdrawOneCoin] =
        useOnboarding("pool_withdraw_one_coin");

    const removing = useMemo(
        () => !!trackingData.isPending || !!removeOneCoinTrackingData.isPending,
        [removeOneCoinTrackingData.isPending, trackingData.isPending]
    );

    const removeUSD = useMemo(
        () => liquidity.multipliedBy(tokenMap[pool.lpToken.identifier].price),
        [liquidity, pool.lpToken.identifier, tokenMap]
    );

    const lpAmount = useMemo(() => {
        return new TokenAmount(pool.lpToken, ownLiquidity);
    }, [pool.lpToken, ownLiquidity]);

    useEffect(() => {
        const pct = lpAmount.equalTo(0)
            ? 0
            : liquidityWei.div(lpAmount.raw).multipliedBy(100).toNumber();
        setLiquidityPercent(pct);
    }, [lpAmount, liquidityWei]);

    const onChangeLiquidityPercent = useCallback(
        (percent: number) => {
            setLiquidityWei(ownLiquidity.multipliedBy(percent).idiv(100));
        },
        [ownLiquidity]
    );

    const estimateRemoveLPOneCoinV1 = useRecoilCallback(
        ({ snapshot }) =>
            async (pool: IPool, lpAmount: BigNumber, tokenIndex: number) => {
                let output = new BigNumber(0);
                const poolData = await snapshot.getPromise(
                    ashRawPoolV1ByAddressQuery(pool.address)
                );
                if (poolData) {
                    try {
                        const { withdrawAmount, withdrawAmountBeforeFee, fee } =
                            calculateEstimatedWithdrawOneCoin(
                                tokenIndex,
                                new BigNumber(poolData.ampFactor || 0),
                                new TokenAmount(
                                    pool.lpToken,
                                    poolData.totalSupply || 0
                                ),
                                new TokenAmount(pool.lpToken, lpAmount),
                                poolData.reserves.map(
                                    (r, i) => new TokenAmount(pool.tokens[i], r)
                                ),
                                new Fraction(
                                    poolData.swapFeePercent || 0,
                                    100_000
                                ),
                                poolData.underlyingPrices?.map(
                                    (p) => new BigNumber(p)
                                )
                            );
                        output = withdrawAmount.raw;
                    } catch (error) {
                        Sentry.captureException(error);
                    }
                }
                return output;
            },
        []
    );

    const estimateRemoveLPOneCoinV2 = useRecoilCallback(
        ({ snapshot }) =>
            async (pool: IPool, lpAmount: BigNumber, tokenIndex: number) => {
                let output = new BigNumber(0);
                const poolData = await snapshot.getPromise(
                    ashRawPoolV2ByAddressQuery(pool.address)
                );
                if (poolData) {
                    try {
                        output = new CurveV2(pool.tokens, {
                            ...poolData,
                            ann: poolData.ampFactor,
                        }).estimateWithdrawOneCoin(lpAmount, tokenIndex);
                    } catch (error) {
                        Sentry.captureException(error);
                    }
                }
                return output;
            },
        []
    );

    const ownLiquidityString = useMemo(() => {
        return ownLiquidity.toString();
    }, [ownLiquidity]);

    const canRemoveLP = useMemo(() => {
        return (
            !removing &&
            liquidityWei.gt(0) &&
            (isBalanced || selectedTokenIndex >= 0)
        );
    }, [isBalanced, liquidityWei, removing, selectedTokenIndex]);

    const estimateRemoveLP = useRecoilCallback(
        ({ snapshot }) =>
            async () => {
                if (
                    liquidityDebounce.eq(0) ||
                    liquidityDebounce.isNaN() ||
                    (!isBalanced && selectedTokenIndex === -1)
                ) {
                    setOutputValues(
                        pool.tokens.map((_t, i) => {
                            const t = getTokenFromId(_t.identifier);
                            return new TokenAmount(t, 0);
                        })
                    );
                }
                if (isBalanced) {
                    const { lpReserves } = await snapshot.getPromise(
                        LPBreakDownQuery({
                            poolAddress: pool.address,
                            wei: liquidityDebounce.toString(10),
                        })
                    );
                    const { lpReserves: maxReserves } =
                        await snapshot.getPromise(
                            LPBreakDownQuery({
                                poolAddress: pool.address,
                                wei: ownLiquidityString,
                            })
                        );
                    setOutputValues(
                        pool.tokens.map((_t, i) => {
                            const t = getTokenFromId(_t.identifier);
                            return new TokenAmount(t, lpReserves[i]);
                        })
                    );
                    setMaxOutputValues(
                        pool.tokens.map((_t, i) => {
                            const t = getTokenFromId(_t.identifier);
                            return new TokenAmount(t, maxReserves[i]);
                        })
                    );
                } else if (selectedTokenIndex >= 0) {
                    let output = new BigNumber(0);
                    let maxOutput = new BigNumber(0);
                    if (pool.type === EPoolType.PoolV2) {
                        output = await estimateRemoveLPOneCoinV2(
                            pool,
                            liquidityDebounce,
                            selectedTokenIndex
                        );
                        maxOutput = await estimateRemoveLPOneCoinV2(
                            pool,
                            new BigNumber(ownLiquidityString),
                            selectedTokenIndex
                        );
                    } else {
                        output = await estimateRemoveLPOneCoinV1(
                            pool,
                            liquidityDebounce,
                            selectedTokenIndex
                        );
                        maxOutput = await estimateRemoveLPOneCoinV1(
                            pool,
                            new BigNumber(ownLiquidityString),
                            selectedTokenIndex
                        );
                    }
                    setOutputValues(
                        pool.tokens.map(
                            (t, i) =>
                                new TokenAmount(
                                    t,
                                    i === selectedTokenIndex ? output : 0
                                )
                        )
                    );
                    setMaxOutputValues(
                        pool.tokens.map(
                            (t, i) =>
                                new TokenAmount(
                                    t,
                                    i === selectedTokenIndex ? maxOutput : 0
                                )
                        )
                    );
                }
            },
        [
            liquidityDebounce,
            isBalanced,
            selectedTokenIndex,
            pool,
            ownLiquidityString,
            estimateRemoveLPOneCoinV2,
            estimateRemoveLPOneCoinV1,
        ]
    );

    const removeLPHandle = useCallback(async () => {
        if (!canRemoveLP) return;
        try {
            if (isBalanced) {
                const { sessionId } = await removeLP(
                    pool,
                    liquidityWei,
                    outputValues,
                    slippage
                );
                if (sessionId) onClose?.();
            } else {
                const { sessionId } = await removeLPOneCoin(
                    pool,
                    liquidityWei,
                    outputValues[selectedTokenIndex],
                    slippage,
                    selectedTokenIndex
                );
                if (sessionId) onClose?.();
            }
        } catch (error) {
            // TODO: extension close without response
            console.error(error);
        }
    }, [
        canRemoveLP,
        isBalanced,
        removeLP,
        pool,
        liquidityWei,
        outputValues,
        onClose,
        removeLPOneCoin,
        selectedTokenIndex,
    ]);

    const onChangeIsBalanced = useCallback((val: boolean) => {
        setIsBalanced(val);
        setSelectedTokenIndex(-1);
    }, []);

    useInterval(estimateRemoveLP, blockTimeMs);

    return (
        <div className="px-8 pt-6 pb-16 sm:pb-7">
            <div className="flex flex-row items-center mb-3">
                <div className="mr-3">
                    <div className="text-text-input-3 text-xs">
                        {pool.tokens
                            .map((t) => getTokenFromId(t.identifier).symbol)
                            .join(" & ")}
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    {pool.tokens.map((_t) => {
                        const t = getTokenFromId(_t.identifier);
                        return (
                            <Avatar
                                key={t.identifier}
                                src={t.logoURI}
                                alt={t.symbol}
                                className="w-3.5 h-3.5 first:-ml-0 -ml-1"
                            />
                        );
                    })}
                </div>
            </div>
            <div className="mb-7 flex items-baseline text-2xl font-bold text-yellow-700">
                Withdraw Liquidity
            </div>
            <div className="px-6 py-7 bg-ash-dark-600 flex flex-col sm:flex-row sm:items-center">
                <div className="sm:w-1/2 mb-4 sm:mb-0">
                    <Switch
                        checked={isBalanced}
                        onChange={onChangeIsBalanced}
                        className="inline-flex items-center mb-7"
                        theme="yellow"
                    >
                        <span className="ml-2 font-bold text-sm text-stake-gray-500 underline">
                            Balanced Withdraw
                        </span>
                    </Switch>
                    <div className="font-bold text-xs text-white">
                        We recommend that you make a balanced withdraw if you
                        can.
                    </div>
                </div>
                <div className="hidden sm:block mx-9 border-l border-ash-gray-600 self-stretch"></div>
                <div className="sm:w-1/2 font-medium text-2xs text-stake-gray-500">
                    <div className="mb-4">
                        i.e. Withdraw with balanced proportions incurs the least
                        fees.
                    </div>
                    <div>
                        But if you need to swap to have the correct amounts, it
                        is better to withdraw in unbalanced/single-sided way.
                    </div>
                </div>
            </div>
            <div className="mt-8 mb-12 sm:my-10">
                <div className="relative mb-11 sm:mb-0">
                    <div>
                        <OnboardTooltip
                            open={onboardingWithdrawInput && screenSize.md}
                            placement="left"
                            onArrowClick={() => setOnboardedWithdrawInput(true)}
                            content={({ size }) => (
                                <OnboardTooltip.Panel
                                    size={size}
                                    className="w-36"
                                >
                                    <div className="p-3 text-xs font-bold">
                                        <span className="text-stake-green-500">
                                            Input{" "}
                                        </span>
                                        <span>value or </span>
                                        <span className="text-stake-green-500">
                                            touch the slider
                                        </span>
                                    </div>
                                </OnboardTooltip.Panel>
                            )}
                        >
                            <div>
                                <div className="flex items-center space-x-1 bg-ash-dark-700 sm:bg-transparent pl-4 sm:pl-0">
                                    <div className="w-[8.25rem] sm:w-48 flex items-center font-bold shrink-0 border-r border-r-ash-gray-500 sm:border-r-0">
                                        <span>LP-TOKEN</span>
                                    </div>
                                    <div className="flex-1 flex items-center overflow-hidden bg-ash-dark-700 text-right text-lg h-[4.5rem] px-5 ">
                                        <InputCurrency
                                            className="bg-transparent text-right grow outline-none min-w-0"
                                            placeholder="0"
                                            value={liquidityStr}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value || "";
                                                const wei = new BigNumber(
                                                    e.target.value || 0
                                                ).multipliedBy(
                                                    10 **
                                                        poolData.pool.lpToken
                                                            .decimals
                                                );
                                                if (wei.gt(ownLiquidity)) {
                                                    setLiquidityWei(
                                                        ownLiquidity
                                                    );
                                                } else {
                                                    setLiquidityWei(wei);
                                                    setLiquidityStr(value);
                                                }

                                                setOnboardedWithdrawInput(true);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div
                                    className={`pt-2 pb-4 font-medium text-2xs text-text-input-3 text-right`}
                                >
                                    <span>Available: </span>
                                    <span
                                        className="text-earn cursor-pointer"
                                        onClick={() =>
                                            onChangeLiquidityPercent(100)
                                        }
                                    >
                                        <TextAmt
                                            number={lpAmount.egld}
                                            options={{
                                                notation: "standard",
                                            }}
                                        />{" "}
                                        {lpAmount.token.symbol}
                                    </span>
                                </div>
                            </div>
                        </OnboardTooltip>

                        <div className="flex flex-row items-center space-x-1">
                            <div className="sm:w-48"></div>
                            <div className="flex flex-row items-center flex-1 gap-4">
                                <div className="w-9 shrink-0 font-bold text-sm text-yellow-500">
                                    {formatAmount(liquidityPercent, {
                                        isIntegerAuto: true,
                                    })}
                                    %
                                </div>
                                <Slider
                                    className="ash-slider pt-4 w-full"
                                    step={1}
                                    marks={{
                                        0: <></>,
                                        25: <></>,
                                        50: <></>,
                                        75: <></>,
                                        100: <></>,
                                    }}
                                    handleStyle={{
                                        backgroundColor: "#191629",
                                        borderRadius: 0,
                                        border:
                                            "2px solid " +
                                            theme.extend.colors.slider.track,
                                        width: 7,
                                        height: 7,
                                    }}
                                    min={0}
                                    max={100}
                                    value={liquidityPercent}
                                    onChange={(e) => {
                                        onChangeLiquidityPercent(e);
                                        setOnboardedWithdrawInput(true);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute top-0 sm:-top-28 bottom-[3.3rem] left-1 w-4 sm:w-10 border-l border-dashed rounded-bl-lg border-ash-gray-600"></div>
                        {pool.tokens.map((_t, i) => {
                            const t = getTokenFromId(_t.identifier);
                            return (
                                <div key={t.identifier} className="py-1.5">
                                    <div
                                        className={`absolute top-0 sm:-top-28 left-1 w-4 sm:w-10 border-l border-yellow-500 rounded-bl-lg ${
                                            i === selectedTokenIndex ||
                                            isBalanced
                                                ? "block"
                                                : "hidden"
                                        }`}
                                        style={{
                                            bottom: `${
                                                (pool.tokens.length - i) * 5.3 -
                                                2
                                            }rem`,
                                        }}
                                    ></div>
                                    <div className="flex items-center flex-row space-x-1 pb-6">
                                        <div className="shrink-0 w-36 sm:w-48 flex items-center">
                                            <div className="shrink-0 pr-3 lg:pr-6 relative pl-4 sm:pl-10 w-14 sm:w-[7rem] min-h-[1rem] flex items-center justify-center">
                                                <div
                                                    className={`absolute inset-y-0 left-1 border-b -translate-y-1/2 rounded-bl-lg ${
                                                        isBalanced
                                                            ? "w-full"
                                                            : "w-4 sm:w-10"
                                                    } ${
                                                        i ===
                                                            selectedTokenIndex ||
                                                        isBalanced
                                                            ? "border-yellow-500"
                                                            : "border-dashed border-ash-gray-600"
                                                    }`}
                                                ></div>
                                                <Transition
                                                    show={isBalanced}
                                                    enter="absolute"
                                                    enterFrom="opacity-0"
                                                    enterTo="opacity-100"
                                                    leave="absolute"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                    className="transition-all duration-200 ease-in-out"
                                                >
                                                    <div className="relative p-1 bg-ash-dark-400">
                                                        <ICChevronRight className="w-1.5 h-auto text-yellow-500" />
                                                    </div>
                                                </Transition>
                                                <Transition
                                                    show={!isBalanced}
                                                    enter="absolute"
                                                    enterFrom="opacity-0 scale-90"
                                                    enterTo="opacity-100 scale-100"
                                                    leave="absolute"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                    className="transition-all duration-200 ease-in-out"
                                                >
                                                    <OnboardTooltip
                                                        disabled={i !== 0}
                                                        delayOpen={1000}
                                                        open={
                                                            i === 0 &&
                                                            screenSize.md &&
                                                            onboardingWithdrawOneCoin
                                                        }
                                                        onArrowClick={() =>
                                                            setOnboardedWithdrawOneCoin(
                                                                true
                                                            )
                                                        }
                                                        placement="left"
                                                        content={
                                                            onboardingWithdrawOneCoinTooltipContent
                                                        }
                                                    >
                                                        <div
                                                            className="relative z-10 flex items-center justify-center cursor-pointer"
                                                            onClick={() =>
                                                                setSelectedTokenIndex(
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            <ICHexagonDuo
                                                                className={`transition-all duration-300 h-6 sm:h-12 w-auto  ${
                                                                    selectedTokenIndex ===
                                                                    i
                                                                        ? "fill-yellow-500/20 stroke-yellow-500"
                                                                        : "fill-[#353248] stroke-ash-gray-600 group-hover:stroke-yellow-500"
                                                                }`}
                                                            />
                                                            <ICChevronRight
                                                                className={`transition-all delay-75 absolute w-1.5 sm:w-2 h-auto text-yellow-500 ${
                                                                    selectedTokenIndex ===
                                                                    i
                                                                        ? "opacity-100 scale-100"
                                                                        : "opacity-0 scale-0"
                                                                }`}
                                                            />
                                                        </div>
                                                    </OnboardTooltip>
                                                </Transition>
                                            </div>
                                            <div className="flex items-center overflow-hidden">
                                                <Avatar
                                                    src={t.logoURI}
                                                    alt={t.name}
                                                    className="shrink-0 w-5 h-5 mr-2"
                                                />
                                                <span className="font-bold text-sm text-white truncate">
                                                    {t.symbol}
                                                </span>
                                            </div>
                                        </div>
                                        <InputCurrency
                                            className={`transition-all duration-300 flex-1 overflow-hidden text-right text-lg h-12 px-5 outline-none border ${
                                                isBalanced
                                                    ? "bg-ash-dark-500 border-transparent"
                                                    : selectedTokenIndex === i
                                                    ? "bg-[#1B192D] border-black"
                                                    : "bg-ash-dark-300 border-transparent"
                                            }`}
                                            placeholder="0"
                                            value={outputValues[i]
                                                .toBigNumber()
                                                .toNumber()}
                                            disabled
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="sm:flex justify-end md:gap-8">
                <div className="sm:w-1/2 md:w-1/3">
                    <div className="border-notch-x border-notch-white/50 mt-1.5">
                        <GlowingButton
                            theme="yellow"
                            className="w-full h-12 font-bold clip-corner-1 clip-corner-tl"
                            onClick={removeLPHandle}
                            disabled={!canRemoveLP}
                        >
                            {insufficientEGLD
                                ? "INSUFFICIENT EGLD BALANCE"
                                : "WITHDRAW"}
                        </GlowingButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
const RemoveLiquidityModal = ({ open, onClose, poolData }: Props) => {
    return (
        <BaseModal
            isOpen={!!open}
            onRequestClose={() => onClose && onClose()}
            className="clip-corner-4 clip-corner-tl bg-ash-dark-400 text-white p-4 flex flex-col max-h-full max-w-4xl mx-auto"
        >
            <div className="flex justify-end">
                <BaseModal.CloseBtn />
            </div>
            <div className="grow overflow-auto">
                <RemoveLPContent
                    open={open}
                    onClose={onClose}
                    poolData={poolData}
                />
            </div>
        </BaseModal>
    );
};

export default RemoveLiquidityModal;
