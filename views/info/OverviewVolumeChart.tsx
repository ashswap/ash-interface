import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import useSWR from "swr";
import BarChart from "./components/BarChart";
import { useState } from "react";
import { ChartTimeUnitType } from "interface/chart";
import { CHART_INTERVAL_MAP } from "const/time";

function OverviewVolumeChart() {
    const [unit, setUnit] = useState<ChartTimeUnitType>("D");
    const { data } = useSWR<[number, number][]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/overview/volume?interval=${CHART_INTERVAL_MAP[unit]}`,
        fetcher
    );
    return (
        <BarChart
            data={data || []}
            label="volume"
            mode="sum"
            timeUnit={unit}
            onChangeTimeUnit={setUnit}
        />
    );
}

export default OverviewVolumeChart;
