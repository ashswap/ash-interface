import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import useSWR from "swr";
import AreaChart from "./components/AreaChart";

function OverviewAccAgVolumeChart() {
    const { data } = useSWR<[number, number][]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/aggregator/graph-statistic`,
        fetcher
    );
    return (
        <AreaChart
            data={data || []}
            mode="accumulated"
            label="Accumulated Volume"
        />
    );
}

export default OverviewAccAgVolumeChart;
