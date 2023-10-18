import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import { IESDTInfo } from "helper/token/token";
import useSWR from "swr";
import BarChart from "views/info/components/BarChart";

function TokenVolumeChart({ token }: { token: IESDTInfo }) {
    const { data } = useSWR<[number, number][]>(
        token.identifier
            ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/token/${token.identifier}/graph-statistic?type=volume`
            : null,
        fetcher
    );
    return <BarChart data={data || []} hideInfo mode="sum" />;
}

export default TokenVolumeChart;
