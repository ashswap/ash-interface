import { CHART_INTERVAL } from "const/time";
import { ChartTimeUnitType } from "interface/chart";
import IPool from "interface/pool";
import { ValueOf } from "interface/utilities";
import { useState } from "react";
import PoolLiquidityChart from "./PoolLiquidityChart";
import PoolVolumeChart from "./PoolVolumeChart";
const CHART_TYPES = {
    LIQUIDITY: "Liquidity",
    VOLUME: "Volume",
    // RATIO12: "ratio12",
    // RATIO21: "ratio21",
} as const;
const ChartTypeArr = Object.values(CHART_TYPES);
type ChartType = ValueOf<typeof CHART_TYPES>;
type Props = { pool: IPool };
function PoolChart({ pool }: Props) {
    const [chartType, setChartType] = useState<ChartType>("Liquidity");
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
                            {/* {type.startsWith("ratio")
                                ? type === "ratio12"
                                    ? `${token1.symbol}/${token2.symbol}`
                                    : `${token2.symbol}/${token1.symbol}`
                                : type} */}
                            {type}
                        </button>
                    );
                })}
            </div>
            <div className="grow overflow-hidden">
                {chartType === "Liquidity" && (
                    <PoolLiquidityChart pool={pool} />
                )}
                {chartType === "Volume" && <PoolVolumeChart pool={pool} />}
                {/* {(chartType === "ratio12" || chartType === "ratio21") && (
                    <PoolPriceRatioAreaChart
                        pool={pool}
                        timeUnit={timeUnit}
                        type={chartType}
                    />
                )} */}
                {/* {chartType === "Price" && <TokenPriceAreaChart token={token} timeUnit={timeUnit} />} */}
            </div>
        </div>
    );
}

export default PoolChart;
