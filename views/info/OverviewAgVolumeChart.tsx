import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import useSWR from "swr";
import BarChart from "./components/BarChart";

function OverviewAgVolumeChart() {
    const { data } = useSWR<[number, number][]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/aggregator/graph-statistic`,
        fetcher
    );
    return <BarChart data={data || []} label="Volume" mode="sum" />;
}

export default OverviewAgVolumeChart;
