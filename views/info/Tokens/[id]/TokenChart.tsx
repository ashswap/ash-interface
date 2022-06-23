import { ENVIRONMENT } from "const/env";
import { CHART_INTERVAL } from "const/time";
import { ChartTimeUnitType } from "interface/chart";
import { IToken } from "interface/token";
import { ValueOf } from "interface/utilities";
import React, { useState } from "react";
import TokenLiquidityChart from "./TokenLiquidityChart";
import TokenPriceAreaChart from "./TokenPriceAreaChart";
import TokenPriceChart from "./TokenPriceChart";
import TokenVolumeChart from "./TokenVolumeChart";

const CHART_TYPES = {
    LIQUIDITY: "Liquidity",
    VOLUME: "Volume",
    PRICE: "Price",
} as const;
const ChartTypeArr =
    ENVIRONMENT.NETWORK === "devnet"
        ? Object.values(CHART_TYPES).filter((val) => val !== "Price")
        : Object.values(CHART_TYPES);
type ChartType = ValueOf<typeof CHART_TYPES>;
function TokenChart({ token }: { token: IToken }) {
    const [chartType, setChartType] = useState<ChartType>("Liquidity");
    const [timeUnit, setTimeUnit] = useState<ChartTimeUnitType>("D");
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
                            {type}
                        </button>
                    );
                })}
            </div>
            <div className="grow mb-5 overflow-hidden">
                {chartType === "Liquidity" && (
                    <TokenLiquidityChart token={token} timeUnit={timeUnit} />
                )}
                {chartType === "Volume" && (
                    <TokenVolumeChart token={token} timeUnit={timeUnit} />
                )}
                {/* {chartType === "Price" && <TokenPriceChart token={token} timeUnit={timeUnit} />} */}
                {chartType === "Price" && (
                    <TokenPriceAreaChart token={token} timeUnit={timeUnit} />
                )}
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

export default TokenChart;
