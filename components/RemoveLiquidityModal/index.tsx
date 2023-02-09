import { Slider } from "antd";
import IconRight from "assets/svg/right-yellow.svg";
import { accIsInsufficientEGLDState } from "atoms/dappState";
import {
    ashRawPoolV1ByAddressQuery,
    LPBreakDownQuery,
    PoolsState,
} from "atoms/poolsState";
import { lpTokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal from "components/BaseModal";
import GlowingButton from "components/GlowingButton";
import InputCurrency from "components/InputCurrency";
import TextAmt from "components/TextAmt";
import Token from "components/Token";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { useSwap } from "context/swap";
import { toEGLDD } from "helper/balance";
import { Fraction } from "helper/fraction/fraction";
import { formatAmount } from "helper/number";
import { TokenAmount } from "helper/token/tokenAmount";
import { useOnboarding } from "hooks/useOnboarding";
import usePoolRemoveLP from "hooks/usePoolContract/usePoolRemoveLP";
import { useScreenSize } from "hooks/useScreenSize";
import { Unarray } from "interface/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { theme } from "tailwind.config";
import { useDebounce } from "use-debounce";

interface Props {
    open?: boolean;
    onClose?: () => void;
    poolData: Unarray<PoolsState["poolToDisplay"]>;
}
const RemoveLPContent = ({ open, onClose, poolData }: Props) => {
    const { pool, liquidityData } = poolData;
    const { ownLiquidity } = liquidityData!;
    const [liquidity, setLiquidity] = useState<BigNumber>(new BigNumber(0));
    const [totalUsd, setTotalUsd] = useState<BigNumber>(new BigNumber(0));
    const [liquidityPercent, setLiquidityPercent] = useState<number>(0);
    const [outputValues, setOutputValues] = useState(
        pool.tokens.map((t) => new TokenAmount(t, 0))
    );
    const [liquidityDebounce] = useDebounce(liquidity, 500);
    const screenSize = useScreenSize();
    const insufficientEGLD = useRecoilValue(accIsInsufficientEGLDState);
    const { removeLP, trackingData } = usePoolRemoveLP(true);
    const { slippage } = useSwap();
    const [displayInputLiquidity, setDisplayInputLiquidity] =
        useState<string>("");
    const lpTokenMap = useRecoilValue(lpTokenMapState);

    const [onboardingWithdrawInput, setOnboardedWithdrawInput] = useOnboarding(
        "pool_withdraw_input"
    );

    const removing = useMemo(
        () => !!trackingData.isPending,
        [trackingData.isPending]
    );

    const pricePerLP = useMemo(() => {
        return lpTokenMap[poolData.pool.lpToken.identifier].price;
    }, [lpTokenMap, poolData]);

    const lpAmount = useMemo(() => {
        return new TokenAmount(pool.lpToken, ownLiquidity);
    }, [pool.lpToken, ownLiquidity]);

    // verify input $ and set the new valid $ value
    const computeValidTotalUsd = useCallback(
        (val: BigNumber) => {
            if (val.div(pricePerLP).div(lpAmount.toBigNumber()).gte(0.998)) {
                const validVal = lpAmount
                    .multiply(Fraction.fromBigNumber(pricePerLP))
                    .toBigNumber();
                setDisplayInputLiquidity(validVal.toString(10));
                console.log("validate", pricePerLP.toString(), val.toString())
                return validVal;
            }
            return val;
        },
        [pricePerLP, lpAmount]
    );

    // re-validate totalUSD on pricePerLP, ownLp changes
    useEffect(() => {
        setTotalUsd((val) => computeValidTotalUsd(val));
    }, [computeValidTotalUsd]);

    // calculate % LP tokens - source of truth: totalUsd
    useEffect(() => {
        const pct =
            new BigNumber(pricePerLP).eq(0) || lpAmount.equalTo(0)
                ? 0
                : totalUsd
                      .div(pricePerLP)
                      .div(lpAmount.toBigNumber())
                      .multipliedBy(100)
                      .toNumber();
        setLiquidityPercent(pct);
    }, [pricePerLP, totalUsd, lpAmount]);

    // only set liquidty base on liquidity percent - source of truth: liquidityPercent
    useEffect(() => {
        setLiquidity(
            new BigNumber(
                ownLiquidity.multipliedBy(liquidityPercent).div(100).toFixed(0)
            )
        );
    }, [ownLiquidity, liquidityPercent]);

    // set liquidityPercent indirectly through totalUsd
    const onChangeLiquidityPercent = useCallback(
        (percent: number) => {
            const valid = computeValidTotalUsd(
                lpAmount
                    .toBigNumber()
                    .multipliedBy(percent)
                    .div(100)
                    .multipliedBy(pricePerLP)
            );
            setDisplayInputLiquidity(valid.toString(10));
            setTotalUsd(valid);
        },
        [pricePerLP, lpAmount, computeValidTotalUsd]
    );

    const estimateRemoveLP = useRecoilCallback(
        ({ snapshot }) =>
            async () => {
                if (liquidityDebounce.eq(0) || liquidityDebounce.isNaN()) {
                    return;
                }
                const { lpReserves } = await snapshot.getPromise(
                    LPBreakDownQuery({
                        poolAddress: pool.address,
                        wei: liquidityDebounce.toString(10),
                    })
                );
                setOutputValues(
                    pool.tokens.map((t, i) => new TokenAmount(t, lpReserves[i]))
                );
            },
        [pool.address, pool.tokens, liquidityDebounce]
    );

    const removeLPHandle = useCallback(async () => {
        if (removing || liquidity.eq(0)) return;
        try {
            const { sessionId } = await removeLP(
                pool,
                liquidity,
                outputValues.map((amt) => amt.raw),
                slippage
            );
            if (sessionId) onClose?.();
        } catch (error) {
            // TODO: extension close without response
            console.error(error);
        }
    }, [outputValues, slippage, pool, onClose, liquidity, removing, removeLP]);

    useEffect(() => {
        estimateRemoveLP();
    }, [estimateRemoveLP]);

    return (
        <div className="px-8 pt-6 pb-16 sm:pb-7">
            <div className="flex flex-row items-center mb-3">
                <div className="mr-3">
                    <div className="text-text-input-3 text-xs">
                        {pool.tokens.map((t) => t.symbol).join(" & ")}
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    {pool.tokens.map((t) => (
                        <Avatar
                            key={t.identifier}
                            src={t.logoURI}
                            alt={t.symbol}
                            className="w-3.5 h-3.5 first:-ml-0 -ml-1"
                        />
                    ))}
                </div>
            </div>
            <div className="flex items-baseline text-2xl font-bold text-yellow-700">
                Withdraw Liquidity
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
                            <div className="flex items-center space-x-1 bg-ash-dark-700 sm:bg-transparent pl-4 sm:pl-0">
                                <div className="flex items-center font-bold w-24 shrink-0 border-r border-r-ash-gray-500 sm:border-r-0">
                                    <IconRight className="mr-4" />
                                    <span>TOTAL</span>
                                </div>
                                <div className="flex-1 flex items-center overflow-hidden bg-ash-dark-700 text-right text-lg h-[4.5rem] px-5 ">
                                    <InputCurrency
                                        className="bg-transparent text-right grow outline-none min-w-0"
                                        placeholder="0"
                                        value={displayInputLiquidity}
                                        onChange={(e) => {
                                            const value = e.target.value || "";
                                            setDisplayInputLiquidity(value);
                                            setTotalUsd(
                                                computeValidTotalUsd(
                                                    new BigNumber(
                                                        value.startsWith(".")
                                                            ? "0" + value
                                                            : value || "0"
                                                    )
                                                )
                                            );
                                            setOnboardedWithdrawInput(true);
                                        }}
                                    />
                                    <div className="shrink-0 text-ash-gray-500 ml-2">
                                        $
                                    </div>
                                </div>
                            </div>
                        </OnboardTooltip>

                        <div className="flex flex-row items-center">
                            <div className="sm:w-24"></div>
                            <div className="flex flex-row items-center flex-1 gap-4">
                                <div className="w-9 shrink-0 font-bold text-sm text-yellow-500">
                                    {formatAmount(liquidityPercent)}%
                                </div>
                                <Slider
                                    className="ash-slider pt-4 w-full"
                                    step={1}
                                    marks={{
                                        0: "",
                                        25: "",
                                        50: "",
                                        75: "",
                                        100: "",
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
                        {pool.tokens.map((t, i) => {
                            return (
                                <div key={t.identifier} className="my-1.5">
                                    <div className="flex items-center flex-row space-x-1 bg-ash-dark-700 sm:bg-transparent pl-4 sm:pl-0">
                                        <Token
                                            token={t}
                                            className="w-24 border-r border-r-ash-gray-500 sm:border-r-0"
                                        />
                                        <InputCurrency
                                            className="flex-1 overflow-hidden bg-ash-dark-700 text-right text-lg h-12 px-5 outline-none"
                                            placeholder="0"
                                            value={outputValues[i]
                                                .toBigNumber()
                                                .toNumber()}
                                            disabled
                                        />
                                    </div>
                                    <div className="pt-2 text-2xs sm:text-sm text-text-input-3 text-right">
                                        <span>Available: </span>
                                        <span className="text-earn">
                                            <TextAmt
                                                number={toEGLDD(
                                                    pool.tokens[i].decimals,
                                                    liquidityData?.lpReserves[
                                                        i
                                                    ] || 0
                                                )}
                                                options={{
                                                    notation: "standard",
                                                }}
                                            />{" "}
                                            {pool.tokens[i].symbol}
                                        </span>
                                    </div>
                                    {i !== pool.tokens.length - 1 && (
                                        <div className="text-sm">&</div>
                                    )}
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
                            disabled={removing || liquidity.eq(0)}
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
    const screenSize = useScreenSize();
    return (
        <BaseModal
            isOpen={!!open}
            onRequestClose={() => onClose && onClose()}
            type={screenSize.msm ? "drawer_btt" : "modal"}
            className="clip-corner-4 clip-corner-tl bg-ash-dark-600 p-4
                    sm:mt-28 max-w-4xl mx-auto
                    fixed sm:relative inset-x-0 bottom-0 max-h-screen overflow-auto text-white flex flex-col"
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
