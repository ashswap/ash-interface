import Breadcrumb from "components/Breadcrumb";
import BasicLayout from "components/Layout/Basic";
import GovLayout from "components/Layout/Gov";
import StakeLayout from "components/Layout/stake";
import NavGov from "components/Nav/NavGov";
import { ReactElement } from "react";
import GovBoostStatus from "views/gov/boost/GovBoostStatus";
const breadcrumbLinks = [
    { label: "Stake" },
    { label: "Governance Stake", href: "/gov/stake" },
    { label: "Farm Boost" },
];
function BoostPage() {
    return (
        <>
            <div className="ash-container text-white pt-[1.875rem]">
                <Breadcrumb links={breadcrumbLinks} />
                <div className="mb-7">
                    <h1 className="text-pink-600 text-2xl md:text-5xl font-bold mb-7 md:mb-11">
                        Farm Boost
                    </h1>
                    <NavGov />
                </div>
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
