import useCombinedRefs from "hooks/useCombineRef";
import React, { ForwardedRef, useCallback, useRef, useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
type InputCurrencyProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type"
> & {
    decimals?: number;
    onNumberChange?: (val: number) => void;
};
function InputCurrency(
    { onChange, decimals, onNumberChange, ...rest }: InputCurrencyProps,
    ref: ForwardedRef<HTMLInputElement>
) {
    const _ref = useRef<HTMLInputElement>(null);
    const targetRef = useCombinedRefs<HTMLInputElement>(_ref, ref);

    const [previousVal, setPreviousVal] = useState("");
    const [val, setVal] = useState("");

    const _onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            const raw = e.target.value.replace(/,/g, ".");
            if (raw === "" || inputRegex.test(escapeRegExp(raw))) {
                const numDecimals = raw.split(".")[1]?.length || 0;
                if (
                    typeof decimals === "number" &&
                    decimals >= 0 &&
                    numDecimals > decimals
                ) {
                    e.target.value = previousVal;
                } else {
                    e.target.value = raw;
                    setPreviousVal(raw);
                }
            } else {
                e.target.value = previousVal;
            }
            setVal(e.target.value);
            if (typeof onChange === "function") {
                onChange(e);
            }
        },
        [onChange, previousVal, decimals]
    );

    const num = useMemo(() => {
        const _num = +val;
        return Number.isNaN(_num) ? 0 : _num;
    }, [val]);

    useEffect(() => {
        onNumberChange?.(num);
    }, [num, onNumberChange]);

    return (
        <input
            {...rest}
            ref={targetRef}
            // universal input options
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            // text-specific options
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            minLength={1}
            maxLength={79}
            spellCheck="false"
            onChange={_onChange}
        />
    );
}

export default React.forwardRef(InputCurrency);
