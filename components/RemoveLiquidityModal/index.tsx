import { Slider } from "antd";
import IconRight from "assets/svg/right-yellow.svg";
import { accIsInsufficientEGLDState } from "atoms/dappState";
import {
    LPBreakDownQuery,
    PoolsState
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
import { formatAmount } from "helper/number";
import { getTokenFromId } from "helper/token";
import { TokenAmount } from "helper/token/tokenAmount";
import useInputNumberString from "hooks/useInputNumberString";
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
    const [liquidityWei, setLiquidityWei] = useState<BigNumber>(new BigNumber(0));
    const liquidity = useMemo(() => new TokenAmount(poolData.pool.lpToken, liquidityWei).egld, [liquidityWei, poolData.pool.lpToken]);
    const [liquidityStr, setLiquidityStr] = useInputNumberString(liquidity, pool.lpToken.decimals);
    const [liquidityPercent, setLiquidityPercent] = useState<number>(0);
    const [outputValues, setOutputValues] = useState(
        pool.tokens.map((_t) => {
            const t = getTokenFromId(_t.identifier);
            return new TokenAmount(t, 0)
        })
    );
    const [liquidityDebounce] = useDebounce(liquidityWei, 500);
    const screenSize = useScreenSize();
    const insufficientEGLD = useRecoilValue(accIsInsufficientEGLDState);
    const { removeLP, trackingData } = usePoolRemoveLP(true);
    const { slippage } = useSwap();
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

    const removeUSD = useMemo(() => liquidity.multipliedBy(lpTokenMap[pool.lpToken.identifier].price), [liquidity, lpTokenMap, pool.lpToken.identifier])

    const lpAmount = useMemo(() => {
        return new TokenAmount(pool.lpToken, ownLiquidity);
    }, [pool.lpToken, ownLiquidity]);

    useEffect(() => {
        const pct =
            lpAmount.equalTo(0)
                ? 0
                : liquidityWei
                      .div(lpAmount.raw)
                      .multipliedBy(100)
                      .toNumber();
        setLiquidityPercent(pct);
    }, [lpAmount, liquidityWei]);

    const onChangeLiquidityPercent = useCallback(
        (percent: number) => {
            setLiquidityWei(ownLiquidity.multipliedBy(percent).idiv(100));
        },
        [ownLiquidity]
    );

    const estimateRemoveLP = useRecoilCallback(
        ({ snapshot }) =>
            async () => {
                if (liquidityDebounce.eq(0) || liquidityDebounce.isNaN()) {
                    setOutputValues(
                        pool.tokens.map((_t, i) => {
                            const t = getTokenFromId(_t.identifier);
                            return new TokenAmount(t, 0);
                        })
                    );
                }
                const { lpReserves } = await snapshot.getPromise(
                    LPBreakDownQuery({
                        poolAddress: pool.address,
                        wei: liquidityDebounce.toString(10),
                    })
                );
                setOutputValues(
                    pool.tokens.map((_t, i) => {
                        const t = getTokenFromId(_t.identifier);
                        return new TokenAmount(t, lpReserves[i]);
                    })
                );
            },
        [pool.address, pool.tokens, liquidityDebounce]
    );

    const removeLPHandle = useCallback(async () => {
        if (removing || liquidityWei.eq(0)) return;
        try {
            const { sessionId } = await removeLP(
                pool,
                liquidityWei,
                outputValues,
                slippage
            );
            if (sessionId) onClose?.();
        } catch (error) {
            // TODO: extension close without response
            console.error(error);
        }
    }, [outputValues, slippage, pool, onClose, liquidityWei, removing, removeLP]);

    useEffect(() => {
        estimateRemoveLP();
    }, [estimateRemoveLP]);

    return (
        <div className="px-8 pt-6 pb-16 sm:pb-7">
            <div className="flex flex-row items-center mb-3">
                <div className="mr-3">
                    <div className="text-text-input-3 text-xs">
                        {pool.tokens.map((t) => getTokenFromId(t.identifier).symbol).join(" & ")}
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    {pool.tokens.map((_t) => {
                        const t = getTokenFromId(_t.identifier);
                        return <Avatar
                            key={t.identifier}
                            src={t.logoURI}
                            alt={t.symbol}
                            className="w-3.5 h-3.5 first:-ml-0 -ml-1"
                        />;
                    })}
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
                            <div>

                            <div className="flex items-center space-x-1 bg-ash-dark-700 sm:bg-transparent pl-4 sm:pl-0">
                                <div className="flex items-center font-bold w-24 shrink-0 border-r border-r-ash-gray-500 sm:border-r-0">
                                    <IconRight className="mr-4" />
                                    <span>LP</span>
                                </div>
                                <div className="flex-1 flex items-center overflow-hidden bg-ash-dark-700 text-right text-lg h-[4.5rem] px-5 ">
                                    <InputCurrency
                                        className="bg-transparent text-right grow outline-none min-w-0"
                                        placeholder="0"
                                        value={liquidityStr}
                                        onChange={(e) => {
                                            const value = e.target.value || "";
                                            const wei = new BigNumber(e.target.value || 0).multipliedBy(10**poolData.pool.lpToken.decimals);
                                            if(wei.gt(ownLiquidity)){
                                                setLiquidityWei(ownLiquidity);
                                            }else{
                                                setLiquidityWei(wei);
                                                setLiquidityStr(value);
                                            }
                                            
                                            setOnboardedWithdrawInput(true);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end font-medium text-2xs text-ash-gray-600">
                                ~${formatAmount(removeUSD, {notation: "standard"})}
                            </div>
                            </div>
                        </OnboardTooltip>

                        <div className="flex flex-row items-center">
                            <div className="sm:w-24"></div>
                            <div className="flex flex-row items-center flex-1 gap-4">
                                <div className="w-9 shrink-0 font-bold text-sm text-yellow-500">
                                    {formatAmount(liquidityPercent, {isIntegerAuto: true})}%
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
                        {pool.tokens.map((_t, i) => {
                            const t = getTokenFromId(_t.identifier);
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
                                            {t.symbol}
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
                            disabled={removing || liquidityWei.eq(0)}
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
