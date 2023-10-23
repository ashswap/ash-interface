import { IESDTInfo } from "helper/token/token";
import { ValueOf } from "interface/utilities";
import { useState } from "react";
import TokenLiquidityChart from "./TokenLiquidityChart";
import TokenVolumeChart from "./TokenVolumeChart";

const CHART_TYPES = {
    LIQUIDITY: "Liquidity",
    VOLUME: "Volume",
    // PRICE: "Price",
} as const;
const ChartTypeArr = Object.values(CHART_TYPES);
type ChartType = ValueOf<typeof CHART_TYPES>;
function TokenChart({ token }: { token: IESDTInfo }) {
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
                            {type}
                        </button>
                    );
                })}
            </div>
            <div className="grow overflow-hidden">
                {chartType === "Liquidity" && (
                    <TokenLiquidityChart token={token} />
                )}
                {chartType === "Volume" && <TokenVolumeChart token={token} />}
                {/* {chartType === "Price" && <TokenPriceChart token={token} timeUnit={timeUnit} />} */}
                {/* {chartType === "Price" && (
                    <TokenPriceAreaChart token={token} timeUnit={timeUnit} />
                )} */}
            </div>
        </div>
    );
}

export default TokenChart;
