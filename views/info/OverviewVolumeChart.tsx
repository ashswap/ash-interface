import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import useSWR from "swr";
import BarChart from "./components/BarChart";

function OverviewVolumeChart() {
    const { data } = useSWR<[number, number][]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/overview/volume`,
        fetcher
    );
    return <BarChart data={data || []} label="volume" mode="sum" />;
}

export default OverviewVolumeChart;
