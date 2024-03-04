import { ChartActiveDot } from "components/Chart/ChartActiveDot";
import { ChartLineX } from "components/Chart/ChartLineX";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import { formatAmount } from "helper/number";
import useSWR from "swr";
import AreaChart from "./components/AreaChart";
import { useState } from "react";
import { ChartTimeUnitType } from "interface/chart";
import { CHART_INTERVAL_MAP } from "const/time";

const CustomActiveDot = ({ dotColor, ...props }: any) => {
    const { cx, cy } = props;
    return <ChartActiveDot dotColor={dotColor} cx={cx} cy={cy} />;
};
const CustomTooltipCursor = ({ areaRef, ...props }: any) => {
    const { width, height, left, payloadIndex } = props;
    if (!areaRef.current) return null;
    const y = areaRef.current.state.curPoints[payloadIndex]?.y || 0;
    const value =
        areaRef.current.state.curPoints[payloadIndex]?.payload.value || 0;

    return (
        <ChartLineX
            width={width}
            height={height}
            left={left}
            y={y}
            label={formatAmount(value) || ""}
        />
    );
};
function OverviewLiquidityChart() {
    const [unit, setUnit] = useState<ChartTimeUnitType>("D");
    const { data } = useSWR<[number, number][]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/overview/liquidity?interval=${CHART_INTERVAL_MAP[unit]}`,
        fetcher
    );
    return (
        <AreaChart
            data={data || []}
            label="liquidity"
            mode="latest"
            timeUnit={unit}
            onChangeTimeUnit={setUnit}
        />
    );
}

export default OverviewLiquidityChart;
