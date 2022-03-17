import { PoolsState } from "context/pools";
import { toEGLD } from "helper/balance";
import { fractionFormat } from "helper/number";
import { Unarray } from "interface/utilities";
import { useMemo } from "react";

const usePoolDataFormat = (data: Unarray<PoolsState["poolToDisplay"]>) => {
    const { pool, poolStats, stakedData } = data;
    const { apr_day, emission_apr, total_value_locked, usd_volume } =
        poolStats || {};
    const { capacityPercent, lpValueUsd, ownLiquidity, value0, value1 } =
        stakedData || {};
    const tradingAPR = useMemo(
        () => (apr_day ? fractionFormat(apr_day) : "_"),
        [apr_day]
    );
    const emissionAPR = useMemo(
        () => (emission_apr ? emission_apr === -1 ? "Infinity" : fractionFormat(emission_apr) : "_"),
        [emission_apr]
    );
    const TVL = useMemo(
        () => (total_value_locked ? fractionFormat(total_value_locked) : "_"),
        [total_value_locked]
    );
    const volumn24h = useMemo(
        () => (usd_volume ? fractionFormat(usd_volume) : "_"),
        [usd_volume]
    );
    const fValue0 = useMemo(
        () =>
            value0
                ? fractionFormat(
                      toEGLD(pool.tokens[0], value0.toString()).toNumber()
                  )
                : "_",
        [value0, pool]
    );
    const fValue1 = useMemo(
        () =>
            value1
                ? fractionFormat(
                      toEGLD(pool.tokens[1], value1.toString()).toNumber()
                  )
                : "_",
        [value1, pool]
    );
    const fCapacityPercent = useMemo(
        () =>
            capacityPercent
                ? capacityPercent.lt(0.01)
                    ? "< 0.01"
                    : fractionFormat(capacityPercent.toNumber())
                : "_",
        [capacityPercent]
    );
    const fLpValueUsd = useMemo(
        () => (lpValueUsd ? fractionFormat(lpValueUsd.toNumber()) : "_"),
        [lpValueUsd]
    );
    const fOwnLiquidity = useMemo(
        () =>
            ownLiquidity
                ? fractionFormat(
                      toEGLD(pool.lpToken, ownLiquidity.toString()).toNumber()
                  )
                : "_",
        [ownLiquidity, pool.lpToken]
    );
    return {
        formatedStats: {
            tradingAPR,
            emissionAPR,
            TVL,
            volumn24h,
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
