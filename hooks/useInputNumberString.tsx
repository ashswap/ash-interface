import BigNumber from "bignumber.js";
import { useCallback, useEffect, useMemo, useState } from "react";

const useInputNumberString = (value: BigNumber.Value, decimalPlaces = 3) => {
    const [isDirty, setIsDirty] = useState(false);
    const bigValue = useMemo(() => new BigNumber(value), [value]);
    const [valueStr, setValueStr] = useState("");
    const bigValueStr = useMemo(
        () =>
            bigValue.isNaN()
                ? ""
                : bigValue.eq(0) && !isDirty ? "" : bigValue.decimalPlaces(decimalPlaces ?? 3).toString(10),
        [bigValue, decimalPlaces, isDirty]
    );
    const setValStr = useCallback((val: string) => {
        setValueStr(val === "." ? "0." : val);
        setIsDirty(true);
    }, []);
    useEffect(
        () => setValueStr((val) => (/^\d*\.0*$/.test(val) || val === "" ? val : bigValueStr)),
        [bigValueStr]
    );
    return [valueStr, setValStr] as [
        string,
        React.Dispatch<React.SetStateAction<string>>
    ];
};
export default useInputNumberString;
