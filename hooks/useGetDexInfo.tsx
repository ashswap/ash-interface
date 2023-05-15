import { DEX_PROTOCOLS_MAP } from "const/protocols";
import { useMemo } from "react"

const useGetDexInfo = (type: string) => {
    const info = useMemo(() => {
        return DEX_PROTOCOLS_MAP[type] ?? {name: type};
    }, [type]);

    return info;
}

export default useGetDexInfo;