import BasicLayout from "components/Layout/Basic";
import GovLayout from "components/Layout/Gov";
import StakeLayout from "components/Layout/stake";
import { GraphOptions } from "graphql/type";
import useGraphQLQueryOptions from "graphql/useQueries/useGraphQLQueryOptions";
import { ReactElement } from "react";
import FarmWeightOverview from "views/gov/farmWeight/FarmWeightOverview";
const queryOptions: GraphOptions = { withFC: true, withFB: true };
function FarmWeightPage() {
    useGraphQLQueryOptions(queryOptions);

    return (
        <>
            <div className="ash-container text-white">
                <FarmWeightOverview />
            </div>
        </>
    );
}

FarmWeightPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <BasicLayout>
            <StakeLayout>
                <GovLayout>{page}</GovLayout>
            </StakeLayout>
        </BasicLayout>
    );
};

export default FarmWeightPage;
