import Breadcrumb from "components/Breadcrumb";
import BasicLayout from "components/Layout/Basic";
import GovLayout from "components/Layout/Gov";
import StakeLayout from "components/Layout/stake";
import NavGov from "components/Nav/NavGov";
import { GraphOptions } from "graphql/type";
import useGraphQLQueryOptions from "graphql/useQueries/useGraphQLQueryOptions";
import { ReactElement } from "react";
import DAOPropose from "views/stake/gov/dao/propose";
const breadcrumbLinks = [
    { label: "Stake" },
    { label: "Governance Stake", href: "/stake/gov" },
    { label: "DAO", href: "/stake/gov/dao" },
    { label: "Propose" },
];
const queryOptions: GraphOptions = {};
function DAOProposePage() {
    useGraphQLQueryOptions(queryOptions);

    return (
        <>
            <div className="ash-container text-white pt-[1.875rem]">
                <Breadcrumb links={breadcrumbLinks} />
                <div className="mb-7">
                    <h1 className="text-pink-600 text-2xl md:text-5xl font-bold mb-7 md:mb-11">
                        <span className="text-white">Create </span>Proposal
                    </h1>
                    <NavGov />
                </div>
                <DAOPropose />
            </div>
        </>
    );
}

DAOProposePage.getLayout = function getLayout(page: ReactElement) {
    return (
        <BasicLayout>
            <StakeLayout>
                <GovLayout>{page}</GovLayout>
            </StakeLayout>
        </BasicLayout>
    );
};

export default DAOProposePage;
