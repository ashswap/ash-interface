import BasicLayout from "components/Layout/Basic";
import GovLayout from "components/Layout/Gov";
import StakeLayout from "components/Layout/stake";
import { ReactElement } from "react";
import GovBoostStatus from "views/gov/boost/GovBoostStatus";
function BoostPage() {
    return (
        <>
            <div className="ash-container text-white">
                <GovBoostStatus />
            </div>
        </>
    );
}

BoostPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <BasicLayout>
            <StakeLayout>
                <GovLayout>{page}</GovLayout>
            </StakeLayout>
        </BasicLayout>
    );
};

export default BoostPage;
