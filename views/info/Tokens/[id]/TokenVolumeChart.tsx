import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { CHART_INTERVAL_MAP } from "const/time";
import { fetcher } from "helper/common";
import { IESDTInfo } from "helper/token/token";
import { ChartTimeUnitType } from "interface/chart";
import { useState } from "react";
import useSWR from "swr";
import BarChart from "views/info/components/BarChart";

function TokenVolumeChart({ token }: { token: IESDTInfo }) {
    const [unit, setUnit] = useState<ChartTimeUnitType>("D");
    const { data } = useSWR<[number, number][]>(
        token.identifier
            ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/token/${token.identifier}/graph-statistic?type=volume&interval=${CHART_INTERVAL_MAP[unit]}`
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

export default TokenVolumeChart;
