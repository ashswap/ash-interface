import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import useSWR from "swr";
import BarChart from "./components/BarChart";
import { useState } from "react";
import { ChartTimeUnitType } from "interface/chart";
import { CHART_INTERVAL_MAP } from "const/time";

function OverviewAgVolumeChart() {
    const [unit, setUnit] = useState<ChartTimeUnitType>("D");
    const { data } = useSWR<[number, number][]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/aggregator/graph-statistic?type=volume&interval=${CHART_INTERVAL_MAP[unit]}`,
        fetcher
    );
    return (
        <BarChart
            data={data || []}
            label="Volume"
            mode="sum"
            timeUnit={unit}
            onChangeTimeUnit={setUnit}
        />
    );
}

export default OverviewAgVolumeChart;
