import BigNumber from "bignumber.js";
import { formatAmount } from "helper/number";
import React, { memo, useMemo } from "react";
type TextAmtProps = {
    number: BigNumber.Value;
    className?: string;
    decimalClassName?: string;
    options?: Parameters<typeof formatAmount>[1];
    prefix?: React.ReactNode;
};
function TextAmt({
    number,
    className,
    options,
    decimalClassName,
    prefix
}: TextAmtProps) {
    const [intPart, decimalPart] = useMemo(() => {
        return (
            formatAmount(new BigNumber(number).toNumber(), options)?.split(
                "."
            ) || []
        );
    }, [number, options]);

    const applyDecimalStyle = useMemo(() => {
        return decimalPart && /[0-9]+$/.test(decimalPart);
    }, [decimalPart]);

    return (
        <span translate="no" className={className}>
            {prefix}
            <span>{intPart}</span>
            <span className={`${applyDecimalStyle ? decimalClassName ?? "opacity-70" : ""}`}>
                {decimalPart ? "." + decimalPart : ""}
            </span>
        </span>
    );
}

export default memo(TextAmt);
