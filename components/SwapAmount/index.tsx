import BigNumber from "bignumber.js";
import QuickSelect from "components/QuickSelect";
import TokenSelect from "components/TokenSelect";
import pools from "const/pool";
import { useWallet } from "context/wallet";
import IPool from "interface/pool";
import { IToken } from "interface/token";
import { useMemo } from "react";
import styles from "./SwapAmount.module.css";

interface Props {
    topLeftCorner?: boolean;
    bottomRightCorner?: boolean;
    showQuickSelect?: boolean;
    disableInput?: boolean;
    token?: IToken;
    onChangeToken?: (t: IToken) => void;
    onChangeValue?: (t: string) => void;
    value?: any;
    children?: any;
    type: "from" | "to";
    poolWithToken?: IToken;
    resetPivotToken: () => any
}

const SwapAmount = (props: Props) => {
    const { balances } = useWallet();
    const onSelectToken = (t: IToken) => {
        if (props.onChangeToken) {
            props.onChangeToken(t);
        }
    };

    let validPools = useMemo(() => {
        if (!props.poolWithToken) {
            return undefined;
        }

        return pools.filter(
            p => p.tokens.findIndex(t => t.id == props.poolWithToken?.id) !== -1
        );
    }, [props.poolWithToken]);

    let suggestedTokens = useMemo(() => {
        let tokens: IToken[] = [];

        validPools?.map(p => {
            p.tokens.forEach(t => {
                if (t.id !== props.poolWithToken?.id) {
                    tokens.push(t);
                }
            });
        });

        return tokens;
    }, [validPools, props.poolWithToken]);

    return (
        <div
            className={
                props.topLeftCorner
                    ? styles.topLeftCorner
                    : props.bottomRightCorner
                    ? styles.bottomRightCorner
                    : ""
            }
        >
            <div className="bg-bg flex flex-row px-2.5 pt-3.5 pb-5.5">
                <TokenSelect
                    modalTitle={props.type === "from" ? "Swap from" : "Swap to"}
                    value={props.token}
                    onChange={onSelectToken}
                    validPools={validPools}
                    pivotToken={props.poolWithToken}
                    type={props.type}
                    resetPivotToken={props.resetPivotToken}
                />
                <input
                    className={styles.input}
                    type="number"
                    disabled={props.disableInput}
                    placeholder="0.00"
                    value={props.value}
                    onChange={e =>
                        props.onChangeValue &&
                        props.onChangeValue(e.target.value)
                    }
                />
            </div>
            {props.showQuickSelect && (
                <QuickSelect
                    tokens={suggestedTokens}
                    onChange={onSelectToken}
                />
            )}
            {props.token && (
                <div className="bg-bg px-2.5 pb-3.5 text-sm text-text-input-3">
                    <span>Balance: </span>
                    <span className="text-earn">
                        {balances[props.token.id]
                            ? balances[props.token.id].balance
                                  .div(
                                      new BigNumber(10).exponentiatedBy(
                                          props.token.decimals
                                      )
                                  )
                                  .toFixed(3)
                                  .toString()
                            : "0"}{" "}
                        {props.token.name}
                    </span>
                </div>
            )}
            {props.children}
        </div>
    );
};

export default SwapAmount;
