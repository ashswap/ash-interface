import BigNumber from "bignumber.js";
import { formatAmount } from "helper/number";
import { useCallback, useEffect, useMemo, useState } from "react";

const useInputNumberString = (value: BigNumber.Value, decimalPlaces = 3) => {
    const bigValue = useMemo(() => new BigNumber(value), [value]);
    const [valueStr, setValueStr] = useState("");
    const bigValueStr = useMemo(
        () =>
            bigValue.isNaN()
                ? ""
                : bigValue.decimalPlaces(decimalPlaces).toString(10),
        [bigValue, decimalPlaces]
    );
    useEffect(
        () => setValueStr((val) => (/^0*\.0*$/.test(val) ? val : bigValueStr)),
        [bigValueStr]
    );
    const setValStr = useCallback((val: string) => {
        setValueStr(val === "." ? "0." : val);
    }, []);
    return [valueStr, setValStr] as [
        string,
        React.Dispatch<React.SetStateAction<string>>
    ];
};
export default useInputNumberString;
