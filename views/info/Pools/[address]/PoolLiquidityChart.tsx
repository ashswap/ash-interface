import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import IPool from "interface/pool";
import useSWR from "swr";
import AreaChart from "views/info/components/AreaChart";

function PoolLiquidityChart({ pool }: { pool: IPool }) {
    const { data } = useSWR<[number, number][]>(
        pool.address
            ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/pool/${pool.address}/graph-statistic?type=liquidity`
            : null,
        fetcher
    );
    return <AreaChart data={data || []} mode="latest" hideInfo />;
}

export default PoolLiquidityChart;
