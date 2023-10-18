import { ChartActiveDot } from "components/Chart/ChartActiveDot";
import { ChartLineX } from "components/Chart/ChartLineX";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import { formatAmount } from "helper/number";
import useSWR from "swr";
import AreaChart from "./components/AreaChart";

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
    const { data } = useSWR<[number, number][]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/overview/liquidity`,
        fetcher
    );
    return <AreaChart data={data || []} label="liquidity" mode="latest" />;
}

export default OverviewLiquidityChart;
