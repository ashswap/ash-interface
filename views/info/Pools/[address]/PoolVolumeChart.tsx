import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import IPool from "interface/pool";
import useSWR from "swr";
import BarChart from "views/info/components/BarChart";

function PoolVolumeChart({ pool }: { pool: IPool }) {
    const { data } = useSWR<[number, number][]>(
        pool.address
            ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/pool/${pool.address}/graph-statistic?type=volume`
            : null,
        fetcher
    );
    return <BarChart data={data || []} hideInfo mode="sum" />;
}

export default PoolVolumeChart;
