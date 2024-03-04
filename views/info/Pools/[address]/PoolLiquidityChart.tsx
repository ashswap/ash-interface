import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { CHART_INTERVAL_MAP } from "const/time";
import { fetcher } from "helper/common";
import { ChartTimeUnitType } from "interface/chart";
import IPool from "interface/pool";
import { useState } from "react";
import useSWR from "swr";
import AreaChart from "views/info/components/AreaChart";

function PoolLiquidityChart({ pool }: { pool: IPool }) {
    const [unit, setUnit] = useState<ChartTimeUnitType>("D");
    const { data } = useSWR<[number, number][]>(
        pool.address
            ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/pool/${pool.address}/graph-statistic?type=liquidity&interval=${CHART_INTERVAL_MAP[unit]}`
            : null,
        fetcher
    );
    return (
        <AreaChart
            data={data || []}
            mode="latest"
            hideInfo
            timeUnit={unit}
            onChangeTimeUnit={setUnit}
        />
    );
}

export default PoolLiquidityChart;
