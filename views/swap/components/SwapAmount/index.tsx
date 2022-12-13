import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import InputCurrency from "components/InputCurrency";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import pools from "const/pool";
import { useSwap } from "context/swap";
import { toEGLDD } from "helper/balance";
import { Percent } from "helper/fraction/percent";
import { formatAmount, formatToSignificant } from "helper/number";
import { IESDTInfo } from "helper/token/token";
import { useOnboarding } from "hooks/useOnboarding";
import { useScreenSize } from "hooks/useScreenSize";
import { useEffect, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import { theme } from "tailwind.config";
import { useDebounce } from "use-debounce";
import TokenSelect from "views/swap/components/TokenSelect";
import QuickSelect from "../QuickSelect";
import styles from "./SwapAmount.module.css";

interface Props {
    topLeftCorner?: boolean;
    bottomRightCorner?: boolean;
    showQuickSelect?: boolean;
    disableInput?: boolean;
    children?: any;
    type: "from" | "to";
    resetPivotToken: () => any;
}

const SwapAmount = (props: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const {
        isInsufficentFund,
        setInsufficentFund,
        tokenFrom,
        tokenTo,
        setTokenFrom,
        setTokenTo,
        valueFrom,
        valueTo,
        setValueFrom,
        setValueTo,
    } = useSwap();
    const tokenMap = useRecoilValue(tokenMapState);
    const screenSize = useScreenSize();
    const [deboundValueFrom] = useDebounce(valueFrom, 500);        
    const [onboardingQuickSelectToken, setOnboardedQuickSelectToken] =
        useOnboarding("swap_quick_select_token");
    const [onboardingInputAmt, setOnboardedInputAmt] =
        useOnboarding("swap_input_amt");
    const value = useMemo(() => {
        if (props.type === "from") {
            return valueFrom;
        }

        return valueTo;
    }, [valueTo, valueFrom, props.type]);
    useEffect(() => {
        if (window && props.type === "from" && valueFrom && tokenTo) {
            let dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: "input_value_from",
                amount: valueFrom,
            });
        }
    }, [deboundValueFrom, props.type, tokenTo, valueFrom]);
    const onChangeValue = useMemo(() => {
        if (props.type === "from") {
            return setValueFrom;
        }

        return setValueTo;
    }, [setValueFrom, setValueTo, props.type]);

    const token = useMemo(() => {
        if (props.type === "from") {
            return tokenFrom;
        }
        return tokenTo;
    }, [tokenFrom, tokenTo, props.type]);

    const poolWithToken = useMemo(() => {
        if (props.type === "from") {
            return tokenTo;
        }

        return tokenFrom;
    }, [tokenFrom, tokenTo, props.type]);

    const onChangeToken = useMemo(() => {
        if (props.type === "from") {
            return setTokenFrom;
        }
        return setTokenTo;
    }, [setTokenFrom, setTokenTo, props.type]);

    let validPools = useMemo(() => {
        if (!poolWithToken) {
            return undefined;
        }

        return pools.filter(
            (p) =>
                p.tokens.findIndex(
                    (t) => t.identifier == poolWithToken?.identifier
                ) !== -1
        );
    }, [poolWithToken]);

    let suggestedTokens = useMemo(() => {
        let tokens: IESDTInfo[] = [];

        validPools?.map((p) => {
            p.tokens.forEach((t) => {
                if (t.identifier !== poolWithToken?.identifier) {
                    tokens.push(t);
                }
            });
        });

        return tokens;
    }, [validPools, poolWithToken]);

    const balance = useMemo(() => {
        if (!token) return new BigNumber(0);
        return toEGLDD(
            token.decimals,
            tokenMap[token.identifier]?.balance || 0
        );
    }, [token, tokenMap]);

    useEffect(() => {
        if (props.type === "from") {
            setInsufficentFund(
                new BigNumber(balance).lt(new BigNumber(value || "0"))
            );
        }
    }, [balance, value, props.type, setInsufficentFund]);

    return (
        <div
            className={`${
                props.topLeftCorner
                    ? styles.topLeftCorner
                    : props.bottomRightCorner
                    ? styles.bottomRightCorner
                    : ""
            } ${"relative"}`}
        >
            {props.type === "from" && isInsufficentFund && (
                <>
                    <div className={styles.insufficentFundBorderTop} />
                    <div className={styles.insufficentFundBorderRight} />
                    <div className={styles.insufficentFundBorderBottom} />
                    <div className={styles.insufficentFundBorderLeft} />
                    <div className={styles.insufficentFundBorderCorner1} />
                    <div className={styles.insufficentFundBorderCorner2} />
                </>
            )}
            <OnboardTooltip
                open={
                    props.type === "from" &&
                    tokenFrom &&
                    tokenTo &&
                    screenSize.lg &&
                    onboardingInputAmt
                }
                placement="right"
                onArrowClick={() => setOnboardedInputAmt(true)}
                zIndex={10}
                content={
                    <OnboardTooltip.Panel>
                        <div className="px-6 py-2.5 text-sm font-bold">
                            <span className="text-stake-green-500">
                                Input amount{" "}
                            </span>
                            <span>of value</span>
                        </div>
                    </OnboardTooltip.Panel>
                }
            >
                <div
                    className={`bg-bg flex px-2.5 pt-3.5 pb-4 sm:pb-5.5 ${styles.content}`}
                >
                    <TokenSelect
                        modalTitle={
                            props.type === "from" ? "Swap from" : "Swap to"
                        }
                        value={token}
                        onChange={onChangeToken}
                        validPools={validPools}
                        pivotToken={poolWithToken}
                        type={props.type}
                        resetPivotToken={props.resetPivotToken}
                    />

                    <InputCurrency
                        ref={inputRef}
                        className={`${styles.input} overflow-hidden grow font-medium`}
                        disabled={props.disableInput}
                        placeholder="0.00"
                        value={
                            props.disableInput
                                ? value
                                    ? formatToSignificant(value, 6)
                                    : ""
                                : value
                        }
                        style={{
                            color:
                                props.type === "from" && isInsufficentFund
                                    ? theme.extend.colors["insufficent-fund"]
                                    : undefined,
                        }}
                        decimals={token?.decimals}
                        onChange={(e) => {
                            if (!props.disableInput) {
                                onChangeValue(e.target.value);
                                setOnboardedInputAmt(true);
                            }
                        }}
                    />
                </div>
            </OnboardTooltip>

            {props.showQuickSelect && (
                <OnboardTooltip
                    open={
                        props.type === "to" &&
                        screenSize.lg &&
                        onboardingQuickSelectToken
                    }
                    placement="left"
                    zIndex={10}
                    onArrowClick={() => setOnboardedQuickSelectToken(true)}
                    content={
                        <OnboardTooltip.Panel>
                            <div className="px-6 py-2.5 text-sm font-bold">
                                <span className="text-stake-green-500">
                                    Quick{" "}
                                </span>
                                <span>Selection</span>
                            </div>
                        </OnboardTooltip.Panel>
                    }
                >
                    <div>
                        <QuickSelect
                            className={styles.quickSelectContainer}
                            tokens={suggestedTokens}
                            onChange={(val) => {
                                onChangeToken(val);
                                setOnboardedQuickSelectToken(true);
                            }}
                        />
                    </div>
                </OnboardTooltip>
            )}
            {token && (
                <div
                    className={`${styles.balanceContainer} bg-bg px-2.5 pb-3.5 text-xs sm:text-sm text-text-input-3 flex justify-between`}
                >
                    <div>
                        <span>Balance: </span>
                        <span
                            className={`text-earn ${
                                tokenMap[token.identifier] &&
                                props.type === "from"
                                    ? "select-none cursor-pointer"
                                    : ""
                            }`}
                            onClick={() => {
                                props.type === "from" &&
                                    onChangeValue(balance.toString());
                            }}
                        >
                            {formatAmount(balance.toNumber(), {
                                notation: "standard",
                            })}{" "}
                            {token.symbol}
                        </span>
                    </div>
                    <div className="font-medium text-white">
                        {value ? (
                            <>
                                <span className="text-ash-gray-600">$ </span>
                                <span>
                                    {formatAmount(
                                        +(value || 0) *
                                            (tokenMap[token.identifier]
                                                ?.price || 0),
                                        { notation: "standard" }
                                    )}
                                </span>
                            </>
                        ) : (
                            <span className="text-ash-gray-600">-/-</span>
                        )}
                    </div>
                </div>
            )}
            {props.children}
        </div>
    );
};

export default SwapAmount;
