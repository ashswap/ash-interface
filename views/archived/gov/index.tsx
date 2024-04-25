import BasicLayout from "components/Layout/Basic";
import GovLayout from "components/Layout/Gov";
import StakeLayout from "components/Layout/stake";
import { ReactElement } from "react";
import VotePowerChart from "views/components/VotePowerChart";
import WeeklyFeeTable from "views/components/WeeklyFeeTable";
import GovStats from "views/gov/GovStats";
function GovPage() {
    return (
        <>
            <div className="ash-container text-white">
                <div className="mb-9">
                    <GovStats />
                </div>
                <div className="mb-14">
                    <VotePowerChart />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white mb-5 lg:mb-7">
                        Weekly Summary
                    </h2>
                    <WeeklyFeeTable />
                </div>
            </div>
        </>
    );
}
GovPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <BasicLayout>
            <StakeLayout>
                <GovLayout>{page}</GovLayout>
            </StakeLayout>
        </BasicLayout>
    );
};
export default GovPage;
