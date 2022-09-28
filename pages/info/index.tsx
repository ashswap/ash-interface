import ICArrowRight from "assets/svg/arrow-right.svg";
import InfoLayout from "components/Layout/Info";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import { PoolStatsRecord } from "interface/poolStats";
import { TokenStatsRecord } from "interface/tokenStats";
import { ReactElement, useMemo } from "react";
import useSWR from "swr";
import PoolsTable from "views/info/components/PoolsTable";
import TokenTable from "views/info/components/TokenTable";
import OverviewLiquidityChart from "views/info/OverviewLiquidityChart";
import OverviewVolumeChart from "views/info/OverviewVolumeChart";

function InfoPage() {
    const { data: tokenRecords } = useSWR<TokenStatsRecord[]>(
        ASHSWAP_CONFIG.ashApiBaseUrl + "/token",
        fetcher
    );
    const { data: poolRecords } = useSWR<PoolStatsRecord[]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/pool`,
        fetcher
    );
    const topTokens = useMemo(
        () =>
            tokenRecords?.sort((x, y) => y.volume - x.volume).slice(0, 5) || [],
        [tokenRecords]
    );
    const topPools = useMemo(
        () =>
            poolRecords?.sort((x, y) => y.volume_usd - x.volume_usd).slice(0, 5) || [],
        [poolRecords]
    );
    return (
        <div>
            <div className="text-white py-7 max-w-6xl mx-auto px-6 sm:px-0">
                <ul className="flex space-x-1 text-xs mb-6">
                    <li>Dashboard</li>
                    <li className="text-ash-gray-500">
                        <ICArrowRight className="inline mr-1" />
                        <span>Overview</span>
                    </li>
                </ul>
                <div className="text-4xl font-bold mb-14">Overview</div>
                <div className="grid lg:grid-cols-2 gap-6 mb-18 overflow-hidden">
                    <div className="bg-ash-dark-600 h-80 px-[1.625rem] py-6 overflow-hidden">
                        <OverviewVolumeChart />
                    </div>
                    <div className="bg-ash-dark-600 h-80 px-[1.625rem] py-6 overflow-hidden">
                        <OverviewLiquidityChart />
                    </div>
                </div>
                <div className="mb-18">
                    <h2 className="text-lg text-white font-bold mb-7">
                        Top Tokens
                    </h2>
                    <TokenTable data={topTokens} hidePaging />
                </div>
                <div>
                    <h2 className="text-lg text-white font-bold mb-7">
                        Top Pools
                    </h2>
                    <PoolsTable data={topPools} hidePaging />
                </div>
            </div>
        </div>
    );
}

InfoPage.getLayout = function getLayout(page: ReactElement) {
    return <InfoLayout>{page}</InfoLayout>;
};

export default InfoPage;
