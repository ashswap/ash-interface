import ICArrowRight from "assets/svg/arrow-right.svg";
import InfoLayout from "components/Layout/Info";
import React, { ReactElement } from "react";
import OverviewAggregatorChart from "views/info/OverviewAggregatorChart";

function StakePage() {
    return (
        <div className="text-white py-7 max-w-6xl mx-auto px-6 sm:px-0">
            <ul className="flex space-x-1 text-xs mb-6">
                    <li>Dashboard</li>
                    <li className="text-ash-gray-500">
                        <ICArrowRight className="inline mr-1" />
                        <span>Aggregator</span>
                    </li>
                </ul>
            <div className="mb-16 lg:mb-28">
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-6 lg:mb-16">
                    Aggregator
                </h2>
                <div className="mb-5">
                    <OverviewAggregatorChart />
                </div>
            </div>
        </div>
    );
}

StakePage.getLayout = function getLayout(page: ReactElement) {
    return <InfoLayout>{page}</InfoLayout>;
};

export default StakePage;
