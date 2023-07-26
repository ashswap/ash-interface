import InfoLayout from "components/Layout/Info";
import React, { ReactElement } from "react";
import OverviewAggregatorChart from "views/info/OverviewAggregatorChart";
import { ENVIRONMENT } from "const/env";

function StakePage() {
    return (
        <div className="text-white py-7 max-w-6xl mx-auto px-6 sm:px-0">
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
