import ICArrowRight from "assets/svg/arrow-right.svg";
import InfoLayout from "components/Layout/Info";
import AprByPoolsChart from "components/Pages/Pools/AprByPoolsChart";
import LiquidityByTokensChart from "components/Pages/Pools/LiquidityByTokensChart";
import PoolsTable from "components/Pages/Pools/PoolsTable";
import React, { ReactElement } from "react";

function PoolsPage() {
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
                    <div className="flex flex-wrap 2xl:flex-nowrap">
                        <div className="w-full 2xl:w-[56%] 2xl:mr-4 mb-[3.625rem]">
                            <AprByPoolsChart />
                        </div>
                        <div className="max-w-full w-full lg:w-[26rem] 2xl:w-[44%] mb-[3.625rem]">
                            <LiquidityByTokensChart/>
                        </div>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-7">Top Pools - Pairs</h2>
                    <PoolsTable/>
                </div>
            </div>
        </div>
    );
}

PoolsPage.getLayout = function getLayout(page: ReactElement) {
    return <InfoLayout>{page}</InfoLayout>;
};

export default PoolsPage;
