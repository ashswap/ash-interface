import { IToken } from "interface/token";
import { ValueOf } from "interface/utilities";
import React, { useState } from "react";
import TokenLiquidityChart from "./TokenLiquidityChart";
import TokenPriceChart from "./TokenPriceChart";
import TokenVolumeChart from "./TokenVolumeChart";

const CHART_TYPES = {
    LIQUIDITY: "Liquidity",
    VOLUMN: "Volumn",
    PRICE: "Price",
} as const;
const ChartTypeArr = Object.values(CHART_TYPES);
type ChartType = ValueOf<typeof CHART_TYPES>;
const interval = ["D", "W", "M"] as const;
export type TokenChartTimeUnitType = typeof interval[number];
function TokenChart({token}: {token: IToken}) {
    const [chartType, setChartType] = useState<ChartType>("Liquidity");
    const [timeUnit, setTimeUnit] = useState<TokenChartTimeUnitType>("D");
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
                {chartType === "Liquidity" && <TokenLiquidityChart token={token} timeUnit={timeUnit} />}
                {chartType === "Volumn" && <TokenVolumeChart token={token} timeUnit={timeUnit}/>}
                {chartType === "Price" && <TokenPriceChart timeUnit={timeUnit} />}
            </div>
            <div className="text-ash-gray-500 flex space-x-2 flex-shrink-0">
                {interval.map((unit) => {
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
