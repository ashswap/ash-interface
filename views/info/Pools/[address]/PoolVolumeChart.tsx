import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { CHART_INTERVAL_MAP } from "const/time";
import { fetcher } from "helper/common";
import { ChartTimeUnitType } from "interface/chart";
import IPool from "interface/pool";
import { useState } from "react";
import useSWR from "swr";
import BarChart from "views/info/components/BarChart";

function PoolVolumeChart({ pool }: { pool: IPool }) {
    const [unit, setUnit] = useState<ChartTimeUnitType>("D");
    const { data } = useSWR<[number, number][]>(
        pool.address
            ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/pool/${pool.address}/graph-statistic?type=volume&interval=${CHART_INTERVAL_MAP[unit]}`
            : null,
        fetcher
    );
    return (
        <BarChart
            data={data || []}
            hideInfo
            mode="sum"
            timeUnit={unit}
            onChangeTimeUnit={setUnit}
        />
    );
}

export default PoolVolumeChart;
