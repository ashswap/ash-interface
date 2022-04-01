import ICArrowRight from "assets/svg/arrow-right.svg";
import InfoLayout from "components/Layout/Info";
import AprByPoolsChart from "views/info/Pools/AprByPoolsChart";
import LiquidityByTokensChart from "views/info/Pools/LiquidityByTokensChart";
import PoolsTable from "views/info/components/PoolsTable";
import React, { ReactElement } from "react";
import useSWR from "swr";
import { PoolStatsRecord } from "interface/poolStats";
import { network } from "const/network";
import { fetcher } from "helper/common";

function PoolsPage() {
    const { data } = useSWR<PoolStatsRecord[]>(
        `${network.ashApiBaseUrl}/pool`,
        fetcher
    );
    return (
        <div>
            <div>
                <div className="text-white py-7 max-w-6xl mx-auto px-6 sm:px-0">
                    <ul className="flex space-x-1 text-xs mb-6">
                        <li>Dashboard</li>
                        <li className="text-ash-gray-500">
                            <ICArrowRight className="inline mr-1" />
                            <span>Pools</span>
                        </li>
                    </ul>
                    <h1 className="text-4xl font-bold mb-[3.625rem] text-white">
                        Pools
                    </h1>
                    {/* <div className="flex flex-wrap 2xl:flex-nowrap">
                        <div className="w-full 2xl:w-[56%] 2xl:mr-4 mb-[3.625rem]">
                            <AprByPoolsChart />
                        </div>
                        <div className="max-w-full w-full lg:w-[26rem] 2xl:w-[44%] mb-[3.625rem]">
                            <LiquidityByTokensChart/>
                        </div>
                    </div> */}
                    <div className="max-w-full w-full lg:w-[31.625rem] 2xl:w-[44%] mb-[3.625rem]">
                            <LiquidityByTokensChart/>
                        </div>
                    <h2 className="text-lg font-bold text-white mb-7">Top Pools - Pairs</h2>
                    <PoolsTable data={data || []}/>
                </div>
            </div>
        </div>
    );
}

PoolsPage.getLayout = function getLayout(page: ReactElement) {
    return <InfoLayout>{page}</InfoLayout>;
};

export default PoolsPage;
