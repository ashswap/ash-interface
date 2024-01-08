import ImgCgkIcon from "assets/images/coingecko-icon.webp";
import Fire from "assets/images/fire.png";
import ICArrowDownRounded from "assets/svg/arrow-down-rounded.svg";
import ICArrowRight from "assets/svg/arrow-right.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";
import ICClock from "assets/svg/clock.svg";
import IconClose from "assets/svg/close.svg";
import ICHierarchySquare from "assets/svg/hierarchy-square.svg";
import IconRight from "assets/svg/right-white.svg";
import ICSetting from "assets/svg/setting.svg";
import IconWallet from "assets/svg/wallet.svg";
import {
    accIsInsufficientEGLDState,
    accIsLoggedInState,
} from "atoms/dappState";
import BigNumber from "bignumber.js";
import BaseButton from "components/BaseButton";
import BaseModal from "components/BaseModal";
import GlowingButton from "components/GlowingButton";
import HistoryModal from "components/HistoryModal";
import IconButton from "components/IconButton";
import Image from "components/Image";
import Setting from "components/Setting";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import { Fraction } from "helper/fraction/fraction";
import { Percent } from "helper/fraction/percent";
import { formatAmount } from "helper/number";
import { TokenAmount } from "helper/token/tokenAmount";
import { useConnectWallet } from "hooks/useConnectWallet";
import useMounted from "hooks/useMounted";
import { useScreenSize } from "hooks/useScreenSize";
import useUnwrapWEGLD from "hooks/useWrappedEGLDContract/useUnwrapWEGLD";
import useWrapEGLD from "hooks/useWrappedEGLDContract/useWrapEGLD";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";

import styles from "../Swap.module.css";
import {
    agAmountInAtom,
    agIsUnwrapSelector,
    agIsWrapSelector,
    agSlippageAtom,
    agTokenInAtom,
    agTokenOutAtom,
} from "./atoms/aggregator";
import SwapAmount from "./components/SwapAmount";

import { toEGLDD, toWei } from "helper/balance";
import useAGAggregate from "hooks/useAggregator/useAGAggregate";
import BatchSwapSorRoute from "./components/BatchSwap/BatchSwapSorRoute";

import Avatar from "components/Avatar";
import Checkbox from "components/Checkbox";
import { blockTimeMs } from "const/dappConfig";
import {
    useAgCgkPrices,
    useAgSor,
    useAgTokenBalance,
    useXexchangeRouter,
} from "./hooks";
import * as Sentry from "@sentry/nextjs";
import { useDebounce } from "use-debounce";
const Aggregator = memo(function Aggregator() {
    const [tokenIn, setTokenIn] = useRecoilState(agTokenInAtom);
    const [tokenOut, setTokenOut] = useRecoilState(agTokenOutAtom);
    const [amountIn, setAmountIn] = useRecoilState(agAmountInAtom);
    const [cgkPriceChangeP, setCgkPriceChangeP] = useState(0);
    const amtIn = useMemo(
        () => toWei(tokenIn, amountIn).idiv(1).toString(10),
        [tokenIn, amountIn]
    );
    const [amtInDebounce] = useDebounce(amtIn, 500);
    // sor routing
    const { data, isValidating: loadingAgResult } = useAgSor(
        tokenIn.identifier,
        tokenOut.identifier,
        amtInDebounce,
        { keepPreviousData: false }
    );
    // xexchange routing
    const { data: xexchangeOutput } = useXexchangeRouter(
        tokenIn.identifier,
        tokenOut.identifier,
        amtInDebounce,
        0.01,
        { refreshInterval: blockTimeMs }
    );
    const tokenInBalance = useAgTokenBalance(tokenIn.identifier);
    const tokenOutBalance = useAgTokenBalance(tokenOut.identifier);
    // coingecko prices
    const ids = useMemo(
        () => [tokenIn.identifier, tokenOut.identifier],
        [tokenIn.identifier, tokenOut.identifier]
    );
    const cgkPrices = useAgCgkPrices(ids, { refreshInterval: 30_000 });
    const tokenInCgkPrice = useMemo(
        () => cgkPrices[tokenIn.identifier],
        [cgkPrices, tokenIn.identifier]
    );
    const tokenOutCgkPrice = useMemo(
        () => cgkPrices[tokenOut.identifier],
        [cgkPrices, tokenOut.identifier]
    );

    const rateVsXexchange = useMemo(() => {
        const xexchangeAmtOut = new BigNumber(
            xexchangeOutput?.swap.amountOut || 0
        );
        if (xexchangeAmtOut.eq(0)) return 0;
        return new BigNumber(data?.returnAmount || 0)
            .multipliedBy(`1e${tokenOut.decimals}`)
            .multipliedBy(100)
            .div(xexchangeAmtOut)
            .minus(100)
            .toNumber();
    }, [data, tokenOut.decimals, xexchangeOutput]);
    const isPriceChangeTooHigh = useMemo(() => {
        return cgkPriceChangeP < -30;
    }, [cgkPriceChangeP]);

    const isPriceImpactTooHigh = useMemo(() => {
        return (data?.priceImpact || 0) * 100 > 30;
    }, [data]);

    const screenSize = useScreenSize();
    const mounted = useMounted();

    const isWrap = useRecoilValue(agIsWrapSelector);
    const isUnwrap = useRecoilValue(agIsUnwrapSelector);
    const slippage = useRecoilValue(agSlippageAtom);
    const isInsufficentFund = useMemo(() => {
        return tokenInBalance?.raw.lt(amtIn);
    }, [amtIn, tokenInBalance]);
    const {
        wrapEGLD,
        trackingData: { isPending: isWrapPending },
    } = useWrapEGLD(true);
    const {
        unwrapWEGLD,
        trackingData: { isPending: isUnwrapPending },
    } = useUnwrapWEGLD(true);
    const [showSetting, setShowSetting] = useState<boolean>(false);
    const [isOpenHistoryModal, openHistoryModal] = useState<boolean>(false);
    const [isOpenFairPrice, setIsOpenFairPrice] = useState(false);
    const [isOpenAgModal, setIsOpenAgModal] = useState(false);
    const [isConfirmSwapAnyway, setIsConfirmSwapAnyway] = useState(false);
    const {
        aggregate,
        trackingData: { isPending: swapping },
    } = useAGAggregate(true);

    const connectWallet = useConnectWallet();
    const loggedIn = useRecoilValue(accIsLoggedInState);
    const isInsufficientEGLD = useRecoilValue(accIsInsufficientEGLDState);

    const revertToken = useRecoilCallback(
        ({ set, snapshot }) =>
            async () => {
                set(agTokenInAtom, await snapshot.getPromise(agTokenOutAtom));
                set(agTokenOutAtom, await snapshot.getPromise(agTokenInAtom));
            },
        []
    );

    const tokenAmountFrom = useMemo(() => {
        if (!amountIn || !tokenIn) {
            return undefined;
        }
        return new TokenAmount(
            tokenIn,
            new BigNumber(10)
                .exponentiatedBy(tokenIn.decimals)
                .multipliedBy(amountIn)
                .integerValue(BigNumber.ROUND_DOWN)
        );
    }, [amountIn, tokenIn]);

    const tokenAmountTo = useMemo(() => {
        if (!tokenAmountFrom) return undefined;
        if (isWrap || isUnwrap) {
            return new TokenAmount(tokenOut, tokenAmountFrom.raw);
        }
        if (!data?.returnAmount || !tokenOut) {
            return undefined;
        }
        return new TokenAmount(
            tokenOut,
            new BigNumber(10)
                .exponentiatedBy(tokenOut.decimals)
                .multipliedBy(data?.returnAmount)
        );
    }, [data?.returnAmount, isUnwrap, isWrap, tokenAmountFrom, tokenOut]);

    const minimumReceive = useMemo(() => {
        if (!tokenAmountTo) {
            return new Fraction(0);
        }
        return new TokenAmount(
            tokenAmountTo.token,
            new Percent(100, 100)
                .subtract(slippage)
                .multiply(tokenAmountTo.raw).quotient
        );
    }, [tokenAmountTo, slippage]);

    const canSwap = useMemo(() => {
        return (
            loggedIn &&
            !swapping &&
            !isWrapPending &&
            !isUnwrapPending &&
            !isInsufficentFund &&
            !isInsufficientEGLD &&
            (isWrap || isUnwrap || (data?.swaps && data?.swaps.length > 0))
        );
    }, [
        data,
        isInsufficentFund,
        isInsufficientEGLD,
        isUnwrap,
        isUnwrapPending,
        isWrap,
        isWrapPending,
        loggedIn,
        swapping,
    ]);

    const swapHandle = useCallback(async () => {
        if (tokenAmountFrom && tokenAmountTo && data?.swaps)
            aggregate(data, tokenAmountFrom, tokenAmountTo);
    }, [aggregate, data, tokenAmountFrom, tokenAmountTo]);

    const wrapHandle = useCallback(async () => {
        if (tokenAmountFrom && !isWrapPending) {
            await wrapEGLD(tokenAmountFrom.raw);
        }
    }, [tokenAmountFrom, isWrapPending, wrapEGLD]);

    const unwrapHandle = useCallback(async () => {
        if (tokenAmountFrom && !isUnwrapPending) {
            await unwrapWEGLD(tokenAmountFrom);
        }
    }, [tokenAmountFrom, isUnwrapPending, unwrapWEGLD]);

    const onClickSwapBtn = useCallback(async () => {
        if (canSwap) {
            if (isWrap) {
                wrapHandle();
            } else if (isUnwrap) {
                unwrapHandle();
            } else {
                swapHandle();
            }
            // setAmountIn("");
        }
    }, [canSwap, isUnwrap, isWrap, swapHandle, unwrapHandle, wrapHandle]);

    useEffect(() => {
        const usdIn = new BigNumber(data?.swapAmount || 0).multipliedBy(
            tokenInCgkPrice
        );
        const usdOut = new BigNumber(data?.returnAmount || 0).multipliedBy(
            tokenOutCgkPrice
        );
        if (usdIn.eq(0) || usdOut.eq(0)) {
            setCgkPriceChangeP(0);
        } else {
            setCgkPriceChangeP(
                usdOut.multipliedBy(100).div(usdIn).plus(-100).toNumber()
            );
        }
    }, [data, tokenInCgkPrice, tokenOutCgkPrice]);

    useEffect(() => {
        if (isPriceChangeTooHigh && isPriceImpactTooHigh)
            setIsConfirmSwapAnyway(false);
    }, [isPriceChangeTooHigh, isPriceImpactTooHigh]);

    useEffect(() => {
        if (tokenIn.identifier) {
            setAmountIn("");
        }
    }, [tokenIn.identifier, setAmountIn]);

    useEffect(() => {
        setShowSetting(false);
        openHistoryModal(false);
    }, [screenSize.isMobile]);

    useEffect(() => {
        // if the rate from xexchange router is better than the rate from SOR 5%
        if (rateVsXexchange < 0) {
            Sentry.captureMessage(
                "warning: the rate from xexchange router is better than the rate from SOR",
                {
                    extra: data,
                }
            );
        }
    }, [data, rateVsXexchange]);

    useEffect(() => {
        if (isPriceChangeTooHigh) {
            Sentry.captureMessage("warning: price change is too high", {
                extra: data,
            });
        }
    }, [data, isPriceChangeTooHigh]);

    return (
        <div className="flex flex-col items-center pt-3.5 pb-12 px-6">
            <div className="flex max-w-full">
                <div
                    className={`w-full max-w-[30.75rem] transition-none relative ${
                        showSetting && !screenSize.isMobile && "sm:w-7/12"
                    }`}
                >
                    <div className="clip-corner-4 clip-corner-tl bg-ash-dark-600 absolute top-0 left-0 right-0 bottom-0 z-[-1]"></div>
                    <div className="text-base">
                        <div className="px-6 py-8 sm:px-12 text-white">
                            <div className={styles.fire}>
                                <Image
                                    src={Fire}
                                    width={151}
                                    height={230}
                                    alt="Ash"
                                />
                            </div>
                            <div className="flex flex-row justify-between pl-4 mb-12">
                                <div className="font-bold text-2xl">Swap</div>
                                <div className="flex flex-row gap-2">
                                    <div>
                                        <BaseButton
                                            className="w-10 h-10 bg-ash-dark-400 hover:bg-ash-dark-300 active:bg-ash-dark-600 text-white"
                                            onClick={() => {
                                                if (loggedIn) {
                                                    openHistoryModal(
                                                        (state) => !state
                                                    );
                                                }
                                            }}
                                        >
                                            <ICClock />
                                        </BaseButton>
                                    </div>
                                    <BaseButton
                                        className="w-10 h-10 bg-ash-dark-400 hover:bg-ash-dark-300 active:bg-ash-dark-600 text-white"
                                        onClick={() =>
                                            setShowSetting((state) => !state)
                                        }
                                    >
                                        <ICSetting
                                            className={`${
                                                showSetting
                                                    ? "text-pink-600"
                                                    : "text-white"
                                            }`}
                                        />
                                    </BaseButton>
                                </div>
                            </div>
                            <div className="relative">
                                <SwapAmount
                                    showQuickSelect={!tokenIn && !!tokenOut}
                                    type="from"
                                    token={tokenIn}
                                    value={amountIn}
                                    pivotToken={tokenOut}
                                    cgkPrice={tokenInCgkPrice}
                                    tokenBalance={tokenInBalance}
                                    onTokenChange={(token) => setTokenIn(token)}
                                    onValueChange={(val) => setAmountIn(val)}
                                />
                                <div
                                    style={{
                                        height: 4,
                                        position: "relative",
                                    }}
                                >
                                    <BaseButton
                                        className="w-7 h-7 rounded-lg bg-ash-dark-600 hover:bg-ash-dark-300 active:bg-ash-dark-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]"
                                        onClick={revertToken}
                                    >
                                        <ICArrowDownRounded />
                                    </BaseButton>
                                </div>
                                <SwapAmount
                                    showQuickSelect={!!tokenIn && !tokenOut}
                                    type="to"
                                    disableInput
                                    token={tokenOut}
                                    pivotToken={tokenIn}
                                    value={tokenAmountTo?.egld.toString() || ""}
                                    onTokenChange={(token) =>
                                        setTokenOut(token)
                                    }
                                    cgkPrice={tokenOutCgkPrice}
                                    tokenBalance={tokenOutBalance}
                                >
                                    <div className="mt-10 mb-2 mx-2.5">
                                        <button
                                            className={`transition-all group px-6 py-4 w-full bg-ash-dark-600 flex items-center justify-between hover:colored-drop-shadow-md hover:colored-drop-shadow-ash-dark-600 disabled:colored-drop-shadow-none disabled:cursor-not-allowed disabled:text-ash-gray-600 ${
                                                loadingAgResult
                                                    ? "disabled:bg-ash-dark-600"
                                                    : "disabled:bg-stake-dark-500"
                                            }`}
                                            style={{
                                                borderWidth: "1px",
                                                borderImageSlice: 1,
                                                borderImageSource: `radial-gradient(90.48% 86.43% at 89.33% 11.52%, rgba(255, 0, 92, 0.5) 0%, black 100%)`,
                                            }}
                                            disabled={
                                                !data?.routes?.length ||
                                                loadingAgResult
                                            }
                                            onClick={() =>
                                                setIsOpenAgModal(true)
                                            }
                                        >
                                            <div className="overflow-hidden flex items-center mr-4">
                                                <ICHierarchySquare className="shrink-0 w-5 h-auto text-stake-gray-500 group-disabled:text-ash-gray-600 mr-2" />
                                                <span className="truncate inline-block font-bold text-sm text-white group-disabled:text-ash-gray-600">
                                                    Aggregator Route
                                                </span>
                                            </div>
                                            <div className="relative flex justify-end items-center">
                                                <div
                                                    className={`shrink-0 transition-all font-bold text-xs text-stake-gray-500 ${
                                                        loadingAgResult
                                                            ? "opacity-0"
                                                            : "opacity-100"
                                                    }`}
                                                >
                                                    {data?.routes?.length || 0}{" "}
                                                    {(data?.routes?.length ||
                                                        0) > 1
                                                        ? "Routes"
                                                        : "Route"}
                                                </div>
                                                <div
                                                    className={`transition-all absolute w-5 h-5 mr-2 rounded-full border-t-transparent border-pink-600 border-4 animate-spin ${
                                                        loadingAgResult
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    }`}
                                                ></div>
                                            </div>
                                        </button>
                                    </div>
                                </SwapAmount>
                            </div>

                            {tokenIn && tokenOut && (
                                <div
                                    className={`flex flex-row justify-between gap-2 text-xs my-5 ${
                                        isPriceChangeTooHigh ||
                                        isPriceImpactTooHigh
                                            ? "text-ash-purple-500"
                                            : "text-ash-green-500"
                                    }`}
                                >
                                    <div
                                        className="opacity-50 font-bold flex flex-row items-center gap-2 select-none cursor-pointer"
                                        onClick={() => {
                                            setIsOpenFairPrice(
                                                (state) => !state
                                            );
                                        }}
                                    >
                                        <div>
                                            {isPriceImpactTooHigh
                                                ? "Price impact is too high"
                                                : isPriceChangeTooHigh
                                                ? "Price change is too high"
                                                : "Fair Price"}
                                        </div>
                                        <div>
                                            {isOpenFairPrice ? (
                                                <ICChevronUp />
                                            ) : (
                                                <ICChevronDown />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {data?.effectivePriceReversed &&
                                        tokenAmountTo?.greaterThan(0) ? (
                                            <>
                                                <span className="inline-block">
                                                    1 {tokenIn?.symbol}
                                                </span>
                                                <span className="inline-block">
                                                    &nbsp;=&nbsp;
                                                </span>
                                                <span className="inline-block">
                                                    {formatAmount(
                                                        data.effectivePriceReversed,
                                                        {
                                                            notation:
                                                                "standard",
                                                            displayThreshold: 0,
                                                        }
                                                    )}{" "}
                                                    {tokenOut?.symbol}
                                                </span>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            )}

                            {isOpenFairPrice &&
                                tokenAmountFrom?.greaterThan(0) && (
                                    <>
                                        <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
                                            <CardTooltip
                                                content={
                                                    <div>
                                                        Making a trade shifts
                                                        the ratio of tokens in
                                                        the pool, causing this
                                                        change in price per
                                                        token.
                                                    </div>
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.swapResultLabel
                                                    }
                                                >
                                                    Price impact
                                                </div>
                                            </CardTooltip>
                                            <div
                                                className={`${
                                                    isPriceImpactTooHigh
                                                        ? "text-ash-purple-500"
                                                        : "text-ash-green-500"
                                                }`}
                                            >
                                                {formatAmount(
                                                    (data?.priceImpact || 0) *
                                                        100,
                                                    {
                                                        notation: "standard",
                                                        displayThreshold: 0,
                                                    }
                                                )}
                                                %
                                            </div>
                                        </div>
                                        <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
                                            <div
                                                className={`${styles.swapResultLabel} flex items-center`}
                                            >
                                                Price change{" "}
                                                <Avatar
                                                    src={ImgCgkIcon}
                                                    alt="coingecko"
                                                    className="ml-2 inline-block w-4 h-4"
                                                />
                                            </div>
                                            <div
                                                className={`text-sm ${
                                                    isPriceChangeTooHigh
                                                        ? "text-ash-purple-500"
                                                        : "text-ash-green-500"
                                                }`}
                                            >
                                                {formatAmount(cgkPriceChangeP, {
                                                    notation: "standard",
                                                    displayThreshold: 0,
                                                })}
                                                %
                                            </div>
                                        </div>
                                        <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
                                            <CardTooltip
                                                content={
                                                    <div>
                                                        The minimum amount you
                                                        would get after
                                                        subtracting fees and
                                                        maximum slippage being
                                                        reached.
                                                    </div>
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.swapResultLabel
                                                    }
                                                >
                                                    Minimum received
                                                </div>
                                            </CardTooltip>
                                            <div className="text-sm">
                                                <TextAmt
                                                    number={minimumReceive.toBigNumber()}
                                                    options={{
                                                        notation: "standard",
                                                    }}
                                                    decimalClassName="text-stake-gray-500"
                                                />
                                                &nbsp;
                                                {tokenOut?.symbol}
                                            </div>
                                        </div>
                                        <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
                                            <CardTooltip
                                                content={
                                                    <div>
                                                        You can change this in
                                                        settings to either make
                                                        sure you get the amount
                                                        you want or your
                                                        transaction will not be
                                                        reverted.
                                                    </div>
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.swapResultLabel
                                                    }
                                                >
                                                    Slippage
                                                </div>
                                            </CardTooltip>
                                            <div className="text-sm">
                                                {formatAmount(
                                                    slippage
                                                        .multiply(100)
                                                        .toBigNumber()
                                                        .toNumber(),
                                                    {
                                                        notation: "standard",
                                                    }
                                                )}
                                                %
                                            </div>
                                        </div>
                                        {/* <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
                                            <CardTooltip
                                                content={
                                                    <div>
                                                        Which liquidity
                                                        providers earn from
                                                        successful transactions.
                                                        Don&apos;t worry,
                                                        It&apos;s small.
                                                    </div>
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.swapResultLabel
                                                    }
                                                >
                                                    Swap fees
                                                </div>
                                            </CardTooltip>
                                            <div className="text-sm">
                                                {tokenAmountTo ? (
                                                    <TextAmt
                                                        number={swapFeeAmt}
                                                        options={{
                                                            notation:
                                                                "standard",
                                                        }}
                                                        decimalClassName="text-stake-gray-500"
                                                    />
                                                ) : (
                                                    "0.00"
                                                )}{" "}
                                                {tokenOut?.symbol}
                                            </div>
                                        </div> */}
                                    </>
                                )}

                            {(isPriceChangeTooHigh || isPriceImpactTooHigh) && (
                                <div className="relative border border-ash-purple-500 bg-black px-6 py-4 font-bold text-xs text-white text-center">
                                    <svg
                                        width="18"
                                        height="61"
                                        viewBox="0 0 18 61"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="absolute -top-2 left-0 -translate-x-1/2 colored-drop-shadow-xs colored-drop-shadow-ash-purple-500"
                                    >
                                        <path
                                            d="M5.05569 0L17.3985 7.75758V15.5152V46.6667L0.941406 31.0303V0H5.05569Z"
                                            fill="#7B61FF"
                                        />
                                        <path
                                            d="M13.2842 60.4125H0.333334V42L17.3984 50.7155L13.2842 60.4125Z"
                                            fill="#7B61FF"
                                        />
                                    </svg>

                                    <div>
                                        {isPriceImpactTooHigh ? (
                                            <>
                                                The price impact is{" "}
                                                <span className="text-ash-purple-500">
                                                    {formatAmount(
                                                        (data?.priceImpact ||
                                                            0) * 100,
                                                        {
                                                            notation:
                                                                "standard",
                                                            displayThreshold: 0,
                                                        }
                                                    )}
                                                    %
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                The price change is{" "}
                                                <span className="text-ash-purple-500">
                                                    {formatAmount(
                                                        cgkPriceChangeP,
                                                        {
                                                            displayThreshold: 0,
                                                        }
                                                    )}
                                                    %
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div>Swap may incur significant losses</div>
                                </div>
                            )}

                            {mounted && (
                                <div className="border-notch-x border-notch-white/50 mt-12">
                                    {loggedIn ? (
                                        isInsufficentFund ||
                                        isInsufficientEGLD ||
                                        (!isPriceChangeTooHigh &&
                                            !isPriceImpactTooHigh) ? (
                                            <GlowingButton
                                                theme="pink"
                                                className="w-full clip-corner-1 clip-corner-tl uppercase h-12 text-xs sm:text-sm font-bold"
                                                disabled={!canSwap}
                                                onClick={onClickSwapBtn}
                                            >
                                                <div className="flex items-center space-x-2.5">
                                                    {isInsufficentFund ||
                                                    isInsufficientEGLD ? (
                                                        <span className="text-text-input-3">
                                                            INSUFFICIENT{" "}
                                                            <span className="text-insufficent-fund">
                                                                {isInsufficientEGLD
                                                                    ? "EGLD"
                                                                    : tokenIn?.symbol}
                                                            </span>{" "}
                                                            BALANCE
                                                        </span>
                                                    ) : (
                                                        <span className="mt-0.5">
                                                            SWAP
                                                        </span>
                                                    )}
                                                    <IconRight />
                                                </div>
                                            </GlowingButton>
                                        ) : (
                                            <GlowingButton
                                                theme="purple"
                                                className="w-full clip-corner-1 clip-corner-tl uppercase h-12 text-xs sm:text-sm font-bold"
                                                disabled={
                                                    !canSwap ||
                                                    !isConfirmSwapAnyway
                                                }
                                                onClick={onClickSwapBtn}
                                            >
                                                <div className="flex items-center space-x-2.5">
                                                    <div
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <Checkbox
                                                            checked={
                                                                isConfirmSwapAnyway
                                                            }
                                                            onChange={(
                                                                checked
                                                            ) =>
                                                                setIsConfirmSwapAnyway(
                                                                    checked
                                                                )
                                                            }
                                                            className="h-4 pl-4 pr-1.5"
                                                        />
                                                    </div>
                                                    <span className="mt-0.5">
                                                        Yes, I Still want to
                                                        Swap
                                                    </span>
                                                    <IconRight />
                                                </div>
                                            </GlowingButton>
                                        )
                                    ) : (
                                        <GlowingButton
                                            theme="pink"
                                            className="w-full clip-corner-1 clip-corner-tl uppercase h-12 text-xs sm:text-sm font-bold"
                                            onClick={connectWallet}
                                        >
                                            <div className="flex items-center space-x-2.5">
                                                <IconWallet />
                                                <span className="mt-0.5">
                                                    CONNECT WALLET
                                                </span>
                                            </div>
                                        </GlowingButton>
                                    )}
                                </div>
                            )}

                            <div
                                className="text-xs font-bold text-center"
                                style={{ marginTop: 34 }}
                            >
                                <span className="text-text-input-3">
                                    DON&apos;T KNOW HOW TO USE IT?{" "}
                                </span>
                                <a
                                    href="https://docs.ashswap.io/guides/swap-trade"
                                    target={"_blank"}
                                    rel="noreferrer"
                                    style={{ color: "#14E499" }}
                                >
                                    VISIT HERE!
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {showSetting && !screenSize.isMobile && (
                    <div className="relative px-12 py-14 bg-ash-dark-600 sm:w-5/12 max-w-[23rem] text-white border-l border-l-ash-gray-600/50">
                        <div className="absolute top-4 right-4">
                            <IconButton
                                icon={<IconClose className="text-white" />}
                                iconSize="small"
                                onClick={() => setShowSetting(false)}
                            />
                        </div>
                        <Setting isAggregator />
                    </div>
                )}
            </div>
            <HistoryModal
                open={isOpenHistoryModal}
                onClose={() => openHistoryModal(false)}
            />
            {screenSize.isMobile && (
                <BaseModal
                    isOpen={showSetting}
                    onRequestClose={() => setShowSetting(false)}
                    type="drawer_btt"
                    className="clip-corner-4 clip-corner-tl bg-ash-dark-600 p-4 text-white flex flex-col max-h-full"
                >
                    <div className="flex justify-end">
                        <BaseModal.CloseBtn />
                    </div>
                    <div className="p-6">
                        <Setting isAggregator />
                        <BaseButton
                            theme="pink"
                            className="uppercase text-xs font-bold mt-10 h-12 w-full"
                            onClick={() => setShowSetting(false)}
                        >
                            Confirm
                        </BaseButton>
                    </div>
                </BaseModal>
            )}
            <BaseModal
                isOpen={isOpenAgModal}
                onRequestClose={() => setIsOpenAgModal(false)}
                className="clip-corner-4 clip-corner-tl bg-ash-dark-600 ash-container w-screen max-w-[1100px] p-4 text-white flex flex-col max-h-full"
            >
                <div className="flex justify-end">
                    <BaseModal.CloseBtn />
                </div>
                <div className="px-6 sm:px-12 pt-8 pb-6 sm:pb-12">
                    <div className="mb-6 flex items-center">
                        <ICHierarchySquare className="w-7 h-auto mr-2 text-stake-gray-500" />
                        <div className="font-bold text-2xl text-white">
                            Aggregator Route
                        </div>
                    </div>
                    <div className="mb-16 flex items-center gap-4 font-bold text-2xl text-ash-gray-600">
                        <span>
                            <TextAmt number={data?.swapAmount || 0} />{" "}
                            {tokenIn.symbol}
                        </span>
                        <ICArrowRight className="w-4 h-auto" />
                        <span>
                            <TextAmt number={data?.returnAmount || 0} />{" "}
                            {tokenOut.symbol}
                        </span>
                    </div>
                    {data && <BatchSwapSorRoute swapInfo={data} />}
                    <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3">
                        {xexchangeOutput && rateVsXexchange > 0 && (
                            <div className="bg-ash-dark-400 p-1">
                                <div className="mb-3 pt-1.5 px-4 font-bold text-sm text-white">
                                    xExchange
                                </div>
                                <div className="bg-ash-dark-600 px-4 py-3 font-semi-bold text-xs text-stake-gray-500">
                                    <span>
                                        <TextAmt number={amountIn || 0} />{" "}
                                        {tokenIn.symbol}
                                    </span>
                                    <span>&nbsp;=&nbsp;</span>
                                    <span>
                                        <TextAmt
                                            number={toEGLDD(
                                                tokenOut.decimals,
                                                xexchangeOutput.swap
                                                    .amountOut || 0
                                            )}
                                        />{" "}
                                        {tokenOut.symbol}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </BaseModal>
        </div>
    );
});

export default Aggregator;
