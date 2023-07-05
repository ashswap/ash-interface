import BigNumber from "bignumber.js";
import InputCurrency from "components/InputCurrency";
import { TOKENS } from "const/tokens";
import { MINIMUM_EGLD_AMT } from "const/wrappedEGLD";
import { formatAmount, formatToSignificant } from "helper/number";
import { IESDTInfo } from "helper/token/token";
import { memo, useMemo, useRef } from "react";
import { theme } from "tailwind.config";

import { TokenAmount } from "helper/token/tokenAmount";
import QuickSelect from "views/swap/components/QuickSelect";
import TokenSelect from "./TokenSelect";

interface Props {
    showQuickSelect?: boolean;
    disableInput?: boolean;
    children?: any;
    type: "from" | "to";
    token: IESDTInfo;
    pivotToken?: IESDTInfo;
    value?: string;
    cgkPrice?: number;
    tokenBalance?: TokenAmount;
    onValueChange?: (value: string) => void;
    onTokenChange?: (token: IESDTInfo) => void;

}

const SwapAmount = (props: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const isInsufficientFund = useMemo(() => {
        return props.tokenBalance?.egld.lt(props.value || 0);
    }, [props.tokenBalance, props.value]);
    return (
        <div
            className={`clip-corner-[10px] p-[1px] ${
                props.type === "from" ? "clip-corner-tl" : "clip-corner-br"
            } ${
                isInsufficientFund && props.type === "from"
                    ? "bg-ash-purple-500"
                    : "bg-transparent"
            }`}
        >
            <div
                className={`group bg-bg hover:bg-bg-hover p-2.5 relative clip-corner-[10px] drop-shadow-[1px_1px_white] ${
                    props.type === "from" ? "clip-corner-tl" : "clip-corner-br"
                }`}
            >
                <div className={`flex gap-2 px-2.5 pt-3.5 pb-4 sm:pb-5.5`}>
                    <TokenSelect
                        modalTitle={
                            props.type === "from" ? "Swap from" : "Swap to"
                        }
                        value={props.token}
                        onChange={props.onTokenChange}
                        type={props.type}
                        pivotToken={props.pivotToken}
                    />

                    <InputCurrency
                        ref={inputRef}
                        className={`flex-1 outline-none bg-transparent text-right text-lg sm:text-2xl text-white placeholder-text-input-1 overflow-hidden grow font-medium`}
                        disabled={props.disableInput}
                        placeholder="0.00"
                        value={
                            props.disableInput
                                ? props.value
                                    ? formatToSignificant(props.value, 6)
                                    : ""
                                : props.value
                        }
                        style={{
                            color:
                                props.type === "from" &&
                                isInsufficientFund
                                    ? theme.extend.colors["insufficent-fund"]
                                    : undefined,
                        }}
                        decimals={props.token.decimals}
                        onChange={(e) => {
                            if (!props.disableInput) {
                                props.onValueChange?.(e.target.value);
                            }
                        }}
                    />
                </div>

                {props.showQuickSelect && (
                    <div>
                        <QuickSelect
                            className="bg-transparent"
                            tokens={TOKENS}
                            onChange={(val) => {
                                props.onTokenChange?.(val);
                            }}
                        />
                    </div>
                )}
                {props.token && (
                    <div
                        className={`px-2.5 pb-3.5 text-xs sm:text-sm text-text-input-3 flex justify-between`}
                    >
                        <div>
                            <span>Balance: </span>
                            <span
                                className={`${
                                    props.type === "from"
                                        ? "select-none cursor-pointer text-earn"
                                        : ""
                                }`}
                                onClick={() => {
                                    props.type === "from" &&
                                        props.tokenBalance &&
                                        props.onValueChange?.(
                                            props.token.identifier === "EGLD"
                                                ? BigNumber.max(
                                                      props.tokenBalance.raw
                                                          .minus(
                                                              MINIMUM_EGLD_AMT
                                                          )
                                                          .div(10 ** 18),
                                                      0
                                                  ).toString()
                                                : props.tokenBalance.egld.toString()
                                        );
                                }}
                            >
                                {formatAmount(props.tokenBalance?.egld.toNumber(), {
                                    notation: "standard",
                                })}{" "}
                                {props.token.symbol}
                            </span>
                        </div>
                        <div className="font-medium text-white">
                            {props.value ? (
                                <>
                                    <span className="text-ash-gray-600">
                                        ${" "}
                                    </span>
                                    <span>
                                        {formatAmount(
                                            +(props.value || 0) *
                                                (props.cgkPrice || 0),
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
        </div>
    );
};

export default memo(SwapAmount);
