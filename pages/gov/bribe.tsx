import BasicLayout from "components/Layout/Basic";
import GovLayout from "components/Layout/Gov";
import StakeLayout from "components/Layout/stake";
import { GraphOptions } from "graphql/type";
import useGraphQLQueryOptions from "graphql/useQueries/useGraphQLQueryOptions";
import { ReactElement } from "react";
import BribeOverview from "views/gov/bribe/BribeOverview";
const queryOptions: GraphOptions = { withFB: true, withFC: true };
function BribePage() {
    useGraphQLQueryOptions(queryOptions);
    return (
        <>
            <div className="ash-container text-white">
                <BribeOverview />
            </div>
        </>
    );
}

BribePage.getLayout = function getLayout(page: ReactElement) {
    return (
        <BasicLayout>
            <StakeLayout>
                <GovLayout>{page}</GovLayout>
            </StakeLayout>
        </BasicLayout>
    );
};

export default BribePage;
