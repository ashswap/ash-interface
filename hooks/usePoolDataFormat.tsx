import { PoolsState } from "atoms/poolsState";
import { toEGLD } from "helper/balance";
import { formatAmount } from "helper/number";
import { Unarray } from "interface/utilities";
import { useMemo } from "react";

const usePoolDataFormat = (data: Unarray<PoolsState["poolToDisplay"]>) => {
    const { pool, poolStats, liquidityData } = data;
    const { apr_day, emission_apr, total_value_locked, usd_volume } =
        poolStats || {};
    const { capacityPercent, lpValueUsd, ownLiquidity, value0, value1 } =
        liquidityData || {};
    const tradingAPR = useMemo(() => formatAmount(apr_day || 0), [apr_day]);
    const emissionAPR = useMemo(
        () =>
            emission_apr === -1 ? "Infinity" : formatAmount(emission_apr || 0),
        [emission_apr]
    );
    const TVL = useMemo(
        () => formatAmount(total_value_locked || 0),
        [total_value_locked]
    );
    const volume24h = useMemo(
        () => formatAmount(usd_volume || 0),
        [usd_volume]
    );
    const fValue0 = useMemo(
        () =>
            formatAmount(
                value0
                    ? toEGLD(pool.tokens[0], value0.toString()).toNumber()
                    : 0
            ),
        [value0, pool]
    );
    const fValue1 = useMemo(
        () =>
            formatAmount(
                value1
                    ? toEGLD(pool.tokens[1], value1.toString()).toNumber()
                    : 0
            ),
        [value1, pool]
    );
    const fCapacityPercent = useMemo(
        () =>
            capacityPercent
                ? capacityPercent.lt(0.01)
                    ? "< 0.01"
                    : formatAmount(capacityPercent.toNumber())
                : "0.00",
        [capacityPercent]
    );
    const fLpValueUsd = useMemo(
        () => formatAmount(lpValueUsd ? lpValueUsd.toNumber() : 0),
        [lpValueUsd]
    );
    const fOwnLiquidity = useMemo(
        () =>
            formatAmount(
                ownLiquidity
                    ? toEGLD(pool.lpToken, ownLiquidity.toString()).toNumber()
                    : 0
            ),
        [ownLiquidity, pool.lpToken]
    );
    return {
        formatedStats: {
            tradingAPR,
            emissionAPR,
            TVL,
            volume24h,
        },
        formatedStakedData: {
            fValue0,
            fValue1,
            fCapacityPercent,
            fLpValueUsd,
            fOwnLiquidity,
        },
    };
};
export default usePoolDataFormat;
