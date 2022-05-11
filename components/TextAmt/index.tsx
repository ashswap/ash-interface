import BigNumber from "bignumber.js";
import { formatAmount } from "helper/number";
import React, { useMemo } from "react";
type TextAmtProps = {
    number: BigNumber.Value;
    className?: string;
    decimalClassName?: string;
    options?: Parameters<typeof formatAmount>[1];
};
function TextAmt({
    number,
    className,
    options,
    decimalClassName,
}: TextAmtProps) {
    const [intPart, decimalPart] = useMemo(() => {
        return formatAmount(new BigNumber(number).toNumber(), options)?.split(".") || [];
    }, [number, options]);

    return (
        <span className={className}>
            <span>{intPart}</span>
            <span className={`${decimalClassName ?? "opacity-50"}`}>
                {decimalPart ? "." + decimalPart : ""}
            </span>
        </span>
    );
}

export default TextAmt;
