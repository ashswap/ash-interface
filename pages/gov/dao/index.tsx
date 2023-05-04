import BasicLayout from "components/Layout/Basic";
import GovLayout from "components/Layout/Gov";
import StakeLayout from "components/Layout/stake";
import { GraphOptions } from "graphql/type";
import useGraphQLQueryOptions from "graphql/useQueries/useGraphQLQueryOptions";
import { ReactElement } from "react";
import DAOOverview from "views/gov/dao/DAOOverview";
const queryOptions: GraphOptions = {};
function DAOPage() {
    useGraphQLQueryOptions(queryOptions);

    return (
        <>
            <div className="ash-container text-white">
                <DAOOverview />
            </div>
        </>
    );
}

DAOPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <BasicLayout>
            <StakeLayout>
                <GovLayout>{page}</GovLayout>
            </StakeLayout>
        </BasicLayout>
    );
};

export default DAOPage;
