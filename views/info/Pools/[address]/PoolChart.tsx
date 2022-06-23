import { CHART_INTERVAL } from "const/time";
import { ChartTimeUnitType } from "interface/chart";
import IPool from "interface/pool";
import { ValueOf } from "interface/utilities";
import React, { useMemo, useState } from "react";
import PoolLiquidityChart from "./PoolLiquidityChart";
import PoolPriceRatioAreaChart from "./PoolPriceRatioAreaChart";
import PoolVolumeChart from "./PoolVolumeChart";
const CHART_TYPES = {
    LIQUIDITY: "Liquidity",
    VOLUME: "Volume",
    RATIO12: "ratio12",
    RATIO21: "ratio21",
} as const;
const ChartTypeArr = Object.values(CHART_TYPES);
type ChartType = ValueOf<typeof CHART_TYPES>;
type Props = { pool: IPool };
function PoolChart({ pool }: Props) {
    const [chartType, setChartType] = useState<ChartType>("Liquidity");
    const [timeUnit, setTimeUnit] = useState<ChartTimeUnitType>("D");
    const [token1, token2] = useMemo(() => pool.tokens, [pool]);
    return (
        <div className="flex flex-col px-4 md:px-8 py-4 md:pb-8 md:pt-7 bg-ash-dark-600 h-full overflow-hidden">
            <div className="text-ash-gray-500 flex space-x-2 shrink-0">
                {ChartTypeArr.map((type) => {
                    return (
                        <button
                            key={type}
                            className={`bg-ash-dark-400 h-7 sm:h-9 px-2 sm:px-3.5 text-2xs sm:text-xs ${
                                type === chartType && "text-white"
                            }`}
                            onClick={() => setChartType(type)}
                        >
                            {type.startsWith("ratio")
                                ? type === "ratio12"
                                    ? `${token1.name}/${token2.name}`
                                    : `${token2.name}/${token1.name}`
                                : type}
                        </button>
                    );
                })}
            </div>
            <div className="grow mb-5 overflow-hidden">
                {chartType === "Liquidity" && (
                    <PoolLiquidityChart pool={pool} timeUnit={timeUnit} />
                )}
                {chartType === "Volume" && (
                    <PoolVolumeChart pool={pool} timeUnit={timeUnit} />
                )}
                {(chartType === "ratio12" || chartType === "ratio21") && (
                    <PoolPriceRatioAreaChart
                        pool={pool}
                        timeUnit={timeUnit}
                        type={chartType}
                    />
                )}
                {/* {chartType === "Price" && <TokenPriceAreaChart token={token} timeUnit={timeUnit} />} */}
            </div>
            <div className="text-ash-gray-500 flex space-x-2 shrink-0">
                {CHART_INTERVAL.map((unit) => {
                    return (
                        <button
                            key={unit}
                            className={`w-9 h-9 bg-ash-dark-400 ${
                                timeUnit === unit
                                    ? "text-white"
                                    : "text-ash-gray-500"
                            }`}
                            onClick={() => setTimeUnit(unit)}
                        >
                            {unit}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default PoolChart;
