import { ValueOf } from "interface/utilities";
import React, { useState } from "react";
import TokenLiquidityChart from "./TokenLiquidityChart";

const TIME_UNIT = {
    DAY: "D",
    WEEK: "W",
    MONTH: "M",
} as const;
const CHART_TYPES = {
    LIQUIDITY: "Liquidity",
    VOLUMN: "Volumn",
    PRICE: "Price",
} as const;
const ChartTypeArr = Object.values(CHART_TYPES);
const TimeUnitArr = Object.values(TIME_UNIT);
type ChartType = ValueOf<typeof CHART_TYPES>;
type timeUnitType = ValueOf<typeof TIME_UNIT>;
function TokenChart() {
    const [chartType, setChartType] = useState<ChartType>("Liquidity");
    const [timeUnit, setTimeUnit] = useState<timeUnitType>("D");
    return (
        <div className="flex flex-col px-8 pb-8 pt-7 bg-ash-dark-600 h-full">
            <div className="text-ash-gray-500 flex space-x-2 flex-shrink-0">
                {ChartTypeArr.map((type) => {
                    return (
                        <button
                            key={type}
                            className={`bg-ash-dark-400 h-9 px-3.5 text-xs ${
                                type === chartType && "text-white"
                            }`}
                            onClick={() => setChartType(type)}
                        >
                            {type}
                        </button>
                    );
                })}
            </div>
            <div className="flex-grow mb-5">
                {chartType === "Liquidity" && <TokenLiquidityChart />}
            </div>
            <div className="text-ash-gray-500 flex space-x-2 flex-shrink-0">
                {TimeUnitArr.map((unit) => {
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
