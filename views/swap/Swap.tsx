import Fire from "assets/images/fire.png";
import ICArrowDownRounded from "assets/svg/arrow-down-rounded.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";
import ICClock from "assets/svg/clock.svg";
import IconClose from "assets/svg/close.svg";
import IconRight from "assets/svg/right-white.svg";
import ICSetting from "assets/svg/setting.svg";
import IconWallet from "assets/svg/wallet.svg";
import {
    accIsInsufficientEGLDState,
    accIsLoggedInState,
} from "atoms/dappState";
import { ashRawPoolByAddressQuery, poolFeesQuery } from "atoms/poolsState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseButton from "components/BaseButton";
import BaseModal from "components/BaseModal";
import GlowingButton from "components/GlowingButton";
import HistoryModal from "components/HistoryModal";
import IconButton from "components/IconButton";
import Image from "components/Image";
import Setting from "components/Setting";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { useSwap } from "context/swap";
import { toEGLDD } from "helper/balance";
import { queryPoolContract } from "helper/contracts/pool";
import { Fraction } from "helper/fraction/fraction";
import { Percent } from "helper/fraction/percent";
import { formatAmount } from "helper/number";
import { calculateEstimatedSwapOutputAmount2 } from "helper/stableswap/calculator/amounts";
import { calculateSwapPrice } from "helper/stableswap/calculator/price";
import { Price } from "helper/token/price";
import { IESDTInfo } from "helper/token/token";
import { TokenAmount } from "helper/token/tokenAmount";
import { useConnectWallet } from "hooks/useConnectWallet";
import useMounted from "hooks/useMounted";
import { useOnboarding } from "hooks/useOnboarding";
import usePoolSwap from "hooks/usePoolContract/usePoolSwap";
import { useScreenSize } from "hooks/useScreenSize";
import IPool from "interface/pool";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import SwapAmount from "./components/SwapAmount";
import styles from "./Swap.module.css";
import { useDebounce } from "use-debounce";

const MaiarPoolTooltip = ({
    children,
    pool,
}: {
    children: JSX.Element;
    pool?: IPool;
}) => {
    const [openMaiarPoolTooltip, setOpenMaiarPoolTooltip] = useState(false);
    const screenSize = useScreenSize();
    useEffect(() => {
        setOpenMaiarPoolTooltip(!!pool?.isMaiarPool && screenSize.md);
    }, [pool, screenSize.md]);
    if (!pool?.isMaiarPool) {
        return <>{children}</>;
    }
    return (
        <OnboardTooltip
            open={openMaiarPoolTooltip}
            onArrowClick={() => {
                setOpenMaiarPoolTooltip(false);
            }}
            strategy={screenSize.isMobile ? "absolute" : "fixed"}
            placement="left"
            zIndex={10}
            arrowStyle={() => ({})}
            content={({ size }) => {
                return (
                    <>
                        {pool && (
                            <div
                                style={{
                                    filter: screenSize.isMobile
                                        ? ""
                                        : "drop-shadow(0px 4px 50px rgba(0, 0, 0, 0.5))",
                                    maxWidth: size?.width,
                                }}
                            >
                                <div className="clip-corner-4 clip-corner-bl bg-ash-dark-600 p-[1px] max-w-full sm:max-w-[23rem] backdrop-blur-[30px]">
                                    <div className="clip-corner-4 clip-corner-bl bg-ash-dark-400 px-12 py-6">
                                        <div className="font-bold text-sm leading-tight">
                                            <Avatar
                                                src={pool.tokens[0].logoURI}
                                                alt={pool.tokens[0].symbol}
                                                className="w-4 h-4"
                                            />
                                            &nbsp;
                                            {pool.tokens[0].symbol}
                                            <span> - </span>
                                            <Avatar
                                                src={pool.tokens[1].logoURI}
                                                alt={pool.tokens[1].symbol}
                                                className="w-4 h-4"
                                            />
                                            &nbsp;
                                            {pool.tokens[1].symbol}
                                            <span>
                                                {" "}
                                                only available in Battle of
                                                Yields
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                );
            }}
        >
            {children}
        </OnboardTooltip>
    );
};
const Swap = () => {
    const screenSize = useScreenSize();
    const mounted = useMounted();
    const {
        tokenFrom,
        tokenTo,
        valueFrom,
        valueTo,
        setValueFrom,
        setValueTo,
        setTokenFrom,
        setTokenTo,
        pool,
        isInsufficentFund,
        slippage,
    } = useSwap();
    const [deboundSlippage] = useDebounce(slippage, 500);
    const fees = useRecoilValue(poolFeesQuery(pool?.address || ""));
    const [showSetting, setShowSetting] = useState<boolean>(false);
    const [isOpenHistoryModal, openHistoryModal] = useState<boolean>(false);
    const [isOpenFairPrice, setIsOpenFairPrice] = useState(false);
    const [onboardingHistory, setOnboardedHistory] =
        useOnboarding("swap_history");
    const {
        swap,
        trackingData: { isPending: swapping, isSuccessful },
        sessionId: swapId,
    } = usePoolSwap(true);
    const [priceImpact, setPriceImpact] = useState(0);

    const connectWallet = useConnectWallet();
    const loggedIn = useRecoilValue(accIsLoggedInState);
    const isInsufficientEGLD = useRecoilValue(accIsInsufficientEGLDState);

    const [onboardingFairPrice, setOnboaredFairPrice] =
        useOnboarding("swap_fair_price");

    const revertToken = () => {
        setTokenFrom(tokenTo);
        setTokenTo(tokenFrom);
    };

    const tokenAmountFrom = useMemo(() => {
        if (!valueFrom || !tokenFrom) {
            return undefined;
        }
        return new TokenAmount(
            tokenFrom,
            new BigNumber(10)
                .exponentiatedBy(tokenFrom.decimals)
                .multipliedBy(valueFrom)
                .integerValue(BigNumber.ROUND_DOWN)
        );
    }, [valueFrom, tokenFrom]);

    const tokenAmountTo = useMemo(() => {
        if (!valueTo || !tokenTo) {
            return undefined;
        }
        return new TokenAmount(
            tokenTo,
            new BigNumber(10)
                .exponentiatedBy(tokenTo.decimals)
                .multipliedBy(valueTo)
        );
    }, [valueTo, tokenTo]);

    const rate = useMemo(() => {
        if (!tokenAmountFrom || !tokenAmountTo) return;
        return new Price(tokenAmountTo, tokenAmountFrom);
    }, [tokenAmountFrom, tokenAmountTo]);

    const calcPriceImpact = useRecoilCallback(
        ({ snapshot }) =>
            async () => {
                if (
                    !pool ||
                    !tokenFrom ||
                    !tokenTo ||
                    !tokenAmountFrom ||
                    !tokenAmountTo
                )
                    return;
                const rawPool = await snapshot.getPromise(
                    ashRawPoolByAddressQuery(pool.address)
                );
                if (!rawPool) return;
                const reserves = pool.tokens.map(
                    (t, i) => new TokenAmount(t, rawPool.reserves[i])
                );
                const price = calculateSwapPrice(
                    new BigNumber(rawPool?.ampFactor || 0),
                    reserves,
                    tokenFrom,
                    tokenTo,
                    fees
                );

                const rate = new Price(tokenAmountTo, tokenAmountFrom);
                const priceImpact = new Fraction(1)
                    .subtract(rate.divide(price.invert().asFraction))
                    .multiply(100)
                    .toBigNumber()
                    .toNumber();
                setPriceImpact(priceImpact);
            },
        [pool, tokenFrom, tokenTo, tokenAmountTo, tokenAmountFrom, fees]
    );

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
    useEffect(() => {
        if (
            window &&
            deboundSlippage &&
            !slippage.equalTo(new Percent(100, 100_000))
        ) {
            let dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: "set_slippage",
                amount:
                    slippage.numerator.toNumber() /
                    slippage.denominator.toNumber(),
            });
        }
    }, [deboundSlippage]);
    useEffect(() => {
        if (!tokenFrom) {
            setValueFrom("");
        }
    }, [tokenFrom, setValueFrom]);
    useEffect(() => {
        if (!tokenTo) {
            setValueTo("");
        }
    }, [tokenTo, setValueTo]);

    useEffect(() => {
        calcPriceImpact();
    }, [calcPriceImpact]);

    useEffect(() => {
        setShowSetting(false);
        openHistoryModal(false);
    }, [screenSize.isMobile]);

    const getAmountOut = useRecoilCallback(
        ({ snapshot, set }) =>
            async (
                pool: IPool,
                tokenAmountFrom: TokenAmount,
                tokenTo: IESDTInfo
            ) => {
                const fees = await snapshot.getPromise(
                    poolFeesQuery(pool.address || "")
                );
                const rawPool = await snapshot.getPromise(
                    ashRawPoolByAddressQuery(pool.address || "")
                );
                if (!rawPool) return;
                const reserves = pool.tokens.map(
                    (t, i) => new TokenAmount(t, rawPool.reserves[i])
                );
                const estimated = calculateEstimatedSwapOutputAmount2(
                    new BigNumber(rawPool?.ampFactor || 0),
                    reserves,
                    tokenAmountFrom,
                    tokenTo,
                    fees
                );
                return estimated;
            },
        []
    );

    useEffect(() => {
        if (!pool || !tokenTo || !tokenAmountFrom) {
            setTimeout(() => setValueTo(""), 0);
            return;
        }
        if (pool.isMaiarPool) {
            queryPoolContract
                .getAmountOutMaiarPool(
                    pool.address,
                    tokenAmountFrom.token.identifier,
                    tokenAmountFrom.raw
                )
                .then((res) => {
                    setValueTo(toEGLDD(tokenTo.decimals, res).toString());
                });
            return;
        }
        getAmountOut(pool, tokenAmountFrom, tokenTo).then(
            (estimated) =>
                estimated && setValueTo(estimated.outputAmount.egld.toString())
        );
    }, [getAmountOut, setValueTo, pool, tokenTo, tokenAmountFrom]);

    const swapHandle = useCallback(async () => {
        if (!loggedIn || !tokenFrom || !tokenTo || swapping || !pool) {
            return;
        }

        if (!tokenAmountFrom) return;
        const minWeiOut = TokenAmount.isTokenAmount(minimumReceive)
            ? minimumReceive.raw
            : minimumReceive.numerator;
        if (minWeiOut.eq(0) || minWeiOut.isNaN()) return;
        try {
            await swap(
                pool,
                tokenFrom,
                tokenTo,
                tokenAmountFrom.raw,
                minWeiOut
            );
        } catch (error) {
            console.error(error);
        }

        setValueTo("");
        setValueFrom("");
    }, [
        loggedIn,
        tokenFrom,
        tokenTo,
        swapping,
        pool,
        tokenAmountFrom,
        minimumReceive,
        swap,
        setValueTo,
        setValueFrom,
    ]);

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
                                    <OnboardTooltip
                                        open={
                                            screenSize.lg &&
                                            onboardingHistory &&
                                            !!swapId &&
                                            !!isSuccessful
                                        }
                                        zIndex={10}
                                        placement="top"
                                        onArrowClick={() =>
                                            setOnboardedHistory(true)
                                        }
                                        content={
                                            <OnboardTooltip.Panel>
                                                <div className="px-6 py-2.5 text-sm font-bold text-white">
                                                    <span>View your </span>
                                                    <span className="text-stake-green-500">
                                                        history{" "}
                                                    </span>
                                                    <span>of transactions</span>
                                                </div>
                                            </OnboardTooltip.Panel>
                                        }
                                    >
                                        <div>
                                            <BaseButton
                                                className="w-10 h-10 bg-ash-dark-400 hover:bg-ash-dark-300 active:bg-ash-dark-600 text-white"
                                                onClick={() => {
                                                    if (loggedIn) {
                                                        openHistoryModal(
                                                            (state) => !state
                                                        );
                                                    }
                                                    setOnboardedHistory(true);
                                                }}
                                            >
                                                <ICClock />
                                            </BaseButton>
                                        </div>
                                    </OnboardTooltip>
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
                            <MaiarPoolTooltip pool={pool}>
                                <div className="relative">
                                    <SwapAmount
                                        topLeftCorner
                                        showQuickSelect={
                                            !tokenFrom && !!tokenTo
                                        }
                                        type="from"
                                        resetPivotToken={() =>
                                            setTokenTo(undefined)
                                        }
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
                                        bottomRightCorner
                                        showQuickSelect={
                                            !!tokenFrom && !tokenTo
                                        }
                                        type="to"
                                        resetPivotToken={() =>
                                            setTokenFrom(undefined)
                                        }
                                        disableInput
                                    />
                                </div>
                            </MaiarPoolTooltip>

                            {tokenFrom && tokenTo && (
                                <OnboardTooltip
                                    open={!!valueFrom && onboardingFairPrice}
                                    placement="right"
                                    zIndex={10}
                                    onArrowClick={() =>
                                        setOnboaredFairPrice(true)
                                    }
                                    content={
                                        <OnboardTooltip.Panel>
                                            <div className="px-6 py-2.5 text-sm font-bold text-white">
                                                <span>More details for </span>
                                                <span className="text-stake-green-500">
                                                    Pro-Trader
                                                </span>
                                            </div>
                                        </OnboardTooltip.Panel>
                                    }
                                >
                                    <div
                                        className="flex flex-row justify-between text-xs text-white my-5"
                                        style={{ color: "#00FF75" }}
                                    >
                                        <div
                                            className="opacity-50 font-bold flex flex-row items-center gap-2 select-none cursor-pointer"
                                            onClick={() => {
                                                setIsOpenFairPrice(
                                                    (state) => !state
                                                );
                                                setOnboaredFairPrice(true);
                                            }}
                                        >
                                            <div>Fair price</div>
                                            <div>
                                                {isOpenFairPrice ? (
                                                    <ICChevronUp />
                                                ) : (
                                                    <ICChevronDown />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            {rate ? (
                                                <>
                                                    1 {tokenFrom?.symbol} ={" "}
                                                    {formatAmount(
                                                        rate
                                                            .toBigNumber()
                                                            .toNumber(),
                                                        {
                                                            notation:
                                                                "standard",
                                                            displayThreshold: 0,
                                                        }
                                                    )}{" "}
                                                    {tokenTo?.symbol}
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                </OnboardTooltip>
                            )}

                            {isOpenFairPrice &&
                                pool &&
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
                                                className={
                                                    styles.swapResultValue
                                                }
                                                style={{ color: "#00FF75" }}
                                            >
                                                {formatAmount(priceImpact, {
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
                                            <div
                                                className={
                                                    styles.swapResultValue
                                                }
                                            >
                                                <TextAmt
                                                    number={minimumReceive.toBigNumber()}
                                                    options={{
                                                        notation: "standard",
                                                    }}
                                                    decimalClassName="text-stake-gray-500"
                                                />
                                                &nbsp;{tokenTo?.symbol}
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
                                            <div
                                                className={
                                                    styles.swapResultValue
                                                }
                                            >
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
                                        <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
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
                                            {pool.isMaiarPool ? (
                                                <div
                                                    className={
                                                        styles.swapResultValue
                                                    }
                                                >
                                                    {tokenFrom &&
                                                    tokenAmountFrom ? (
                                                        <TextAmt
                                                            number={tokenAmountFrom
                                                                .multiply(
                                                                    fees.swap
                                                                )
                                                                .toBigNumber()}
                                                            options={{
                                                                notation:
                                                                    "standard",
                                                            }}
                                                            decimalClassName="text-stake-gray-500"
                                                        />
                                                    ) : (
                                                        "0.00"
                                                    )}{" "}
                                                    {tokenFrom?.symbol}
                                                </div>
                                            ) : (
                                                <div
                                                    className={
                                                        styles.swapResultValue
                                                    }
                                                >
                                                    {tokenAmountTo ? (
                                                        <TextAmt
                                                            number={tokenAmountTo
                                                                .multiply(
                                                                    fees.swap
                                                                )
                                                                .toBigNumber()}
                                                            options={{
                                                                notation:
                                                                    "standard",
                                                            }}
                                                            decimalClassName="text-stake-gray-500"
                                                        />
                                                    ) : (
                                                        "0.00"
                                                    )}{" "}
                                                    {tokenTo?.symbol}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                            {mounted && (
                                <div className="border-notch-x border-notch-white/50 mt-12">
                                    <GlowingButton
                                        theme="pink"
                                        className="w-full clip-corner-1 clip-corner-tl uppercase h-12 text-xs sm:text-sm font-bold"
                                        disabled={
                                            swapping ||
                                            isInsufficentFund ||
                                            isInsufficientEGLD
                                        }
                                        onClick={
                                            loggedIn
                                                ? swapHandle
                                                : () => connectWallet()
                                        }
                                    >
                                        <div className="flex items-center space-x-2.5">
                                            {!loggedIn && <IconWallet />}
                                            {isInsufficentFund ||
                                            isInsufficientEGLD ? (
                                                <span className="text-text-input-3">
                                                    INSUFFICIENT{" "}
                                                    <span className="text-insufficent-fund">
                                                        {isInsufficientEGLD
                                                            ? "EGLD"
                                                            : tokenFrom?.symbol}
                                                    </span>{" "}
                                                    BALANCE
                                                </span>
                                            ) : (
                                                <span className="mt-0.5">
                                                    {loggedIn
                                                        ? "SWAP"
                                                        : "CONNECT WALLET"}
                                                </span>
                                            )}

                                            {loggedIn && <IconRight />}
                                        </div>
                                    </GlowingButton>
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
                        <Setting />
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
                    <Setting />
                    <BaseButton
                        theme="pink"
                        className="uppercase text-xs font-bold mt-10 h-12 w-full"
                        onClick={() => setShowSetting(false)}
                    >
                        Confirm
                    </BaseButton>
                </BaseModal>
            )}
        </div>
    );
};

export default Swap;
