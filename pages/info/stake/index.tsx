import ICArrowRight from "assets/svg/arrow-right.svg";
import InfoLayout from "components/Layout/Info";
import React, { ReactElement } from "react";
import TVLLPChart from "views/info/stake/TVLLPChart";
import VotePowerChart from "views/components/VotePowerChart";
import WeeklyFeeTable from "views/components/WeeklyFeeTable";
import FarmsTable from "views/info/stake/FarmsTable";
import useSWR from "swr";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { FarmStatsRecord } from "interface/farmStats";
import { fetcher } from "helper/common";
import { ENVIRONMENT } from "const/env";

function StakePage() {
    const { data: farmRecords } = useSWR<FarmStatsRecord[]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/stake/farming`,
        fetcher
    );
    return (
        <div>
            <div className="text-white py-7 max-w-6xl mx-auto px-6 sm:px-0">
                <ul className="flex space-x-1 text-xs mb-6">
                    <li>Dashboard</li>
                    <li className="text-ash-gray-500">
                        <ICArrowRight className="inline mr-1" />
                        <span>Stake</span>
                    </li>
                </ul>
                <div className="mb-16 lg:mb-28">
                    <h2 className="text-2xl lg:text-4xl font-bold text-white mb-6 lg:mb-16">
                        Liquidity Stake
                    </h2>
                    <div className="mb-5">
                        <TVLLPChart />
                    </div>
                    <FarmsTable data={farmRecords || []} />
                </div>
                <div className="mb-16 lg:mb-28">
                    <h2 className="text-2xl lg:text-4xl font-bold text-white mb-6 lg:mb-16">
                        Governance Stake
                    </h2>
                    <VotePowerChart />
                </div>
                <div className="mb-16 lg:mb-28">
                    <h2 className="text-lg font-bold text-white mb-5 lg:mb-7">
                        Daily Summary
                    </h2>
                    <WeeklyFeeTable />
                </div>
            </div>
        </div>
    );
}

StakePage.getLayout = function getLayout(page: ReactElement) {
    return <InfoLayout>{page}</InfoLayout>;
};

export default StakePage;
