import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import { IESDTInfo } from "helper/token/token";
import useSWR from "swr";
import AreaChart from "views/info/components/AreaChart";

function TokenLiquidityChart({ token }: { token: IESDTInfo }) {
    const { data } = useSWR<[number, number][]>(
        token.identifier
            ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/token/${token.identifier}/graph-statistic?type=liquidity`
            : null,
        fetcher
    );
    return <AreaChart data={data || []} hideInfo mode="latest" />;
}

export default TokenLiquidityChart;
