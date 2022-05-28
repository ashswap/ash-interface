import ICArrowRight from "assets/svg/arrow-right.svg";
import StakeLayout from "components/Layout/stake";
import { ENVIRONMENT } from "const/env";
import React, { ReactElement } from "react";
import VotePowerChart from "views/components/VotePowerChart";
import WeeklyFeeTable from "views/components/WeeklyFeeTable";
import GovState from "views/stake/gov/GovRecoilState";
import GovStats from "views/stake/gov/GovStats";

function GovPage() {
    return (
        <>
            <GovState />
            <div className="ash-container text-white pt-[1.875rem]">
                <ul className="flex space-x-1 mb-4 md:mb-[3.25rem] text-sm md:text-lg font-bold">
                    <li>Stake</li>
                    <li className="text-ash-gray-500">
                        <ICArrowRight className="inline mr-1" />
                        <span>Governance Stake</span>
                    </li>
                </ul>
                <div className="mb-9">
                    <GovStats />
                </div>
                <div className="mb-14">
                    <VotePowerChart />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white mb-5 lg:mb-7">
                        {ENVIRONMENT.NETWORK === "devnet"
                            ? "Daily Summary"
                            : "Weekly Summary"}
                    </h2>
                    <WeeklyFeeTable />
                </div>
            </div>
        </>
    );
}
GovPage.getLayout = function getLayout(page: ReactElement) {
    return <StakeLayout>{page}</StakeLayout>;
};
export default GovPage;
