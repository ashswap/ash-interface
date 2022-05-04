import BigNumber from "bignumber.js";
import InputCurrency from "components/InputCurrency";
import QuickSelect from "components/QuickSelect";
import TokenSelect from "components/TokenSelect";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import pools from "const/pool";
import { useSwap } from "context/swap";
import { useWallet } from "context/wallet";
import { useOnboarding } from "hooks/useOnboarding";
import { useScreenSize } from "hooks/useScreenSize";
import { IToken } from "interface/token";
import { useEffect, useMemo, useRef } from "react";
import { theme } from "tailwind.config";
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
    const { balances } = useWallet();
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
    const screenSize = useScreenSize();
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
            (p) => p.tokens.findIndex((t) => t.id == poolWithToken?.id) !== -1
        );
    }, [poolWithToken]);

    let suggestedTokens = useMemo(() => {
        let tokens: IToken[] = [];

        validPools?.map((p) => {
            p.tokens.forEach((t) => {
                if (t.id !== poolWithToken?.id) {
                    tokens.push(t);
                }
            });
        });

        return tokens;
    }, [validPools, poolWithToken]);

    const balance = useMemo(() => {
        if (!token) {
            return "0";
        }

        return balances[token.id]
            ? balances[token.id].balance
                  .div(new BigNumber(10).exponentiatedBy(token.decimals))
                  .toFixed(3)
                  .toString()
            : "0";
    }, [token, balances]);

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
                    className={`bg-bg flex flex-row px-2.5 pt-3.5 pb-5.5 ${styles.content}`}
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
                        className={`${styles.input} overflow-hidden`}
                        disabled={props.disableInput}
                        placeholder="0.00"
                        value={value}
                        style={{
                            color:
                                props.type === "from" && isInsufficentFund
                                    ? theme.extend.colors["insufficent-fund"]
                                    : undefined,
                        }}
                        onChange={(e) => {
                            onChangeValue(e.target.value);
                            setOnboardedInputAmt(true);
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
                    className={`${styles.balanceContainer} bg-bg px-2.5 pb-3.5 text-sm text-text-input-3`}
                >
                    <span>Balance: </span>
                    <span
                        className={`text-earn ${
                            balances[token.id] && props.type === "from"
                                ? "select-none cursor-pointer"
                                : ""
                        }`}
                        onClick={() => {
                            props.type === "from" && onChangeValue(balance);
                        }}
                    >
                        {balance} {token.name}
                    </span>
                </div>
            )}
            {props.children}
        </div>
    );
};

export default SwapAmount;
