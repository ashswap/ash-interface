import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import useSWR from "swr";
import AreaChart from "./components/AreaChart";
import { ChartTimeUnitType } from "interface/chart";
import { useState } from "react";
import { CHART_INTERVAL_MAP } from "const/time";

function OverviewAccAgVolumeChart() {
    const [unit, setUnit] = useState<ChartTimeUnitType>("D");
    const { data } = useSWR<[number, number][]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/aggregator/graph-statistic?type=accumulated_volume&interval=${CHART_INTERVAL_MAP[unit]}`,
        fetcher
    );
    return (
        <AreaChart
            data={data || []}
            mode="latest"
            label="Accumulated Volume"
            timeUnit={unit}
            onChangeTimeUnit={setUnit}
        />
    );
}

export default OverviewAccAgVolumeChart;
