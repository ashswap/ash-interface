import BasicLayout from "components/Layout/Basic";
import GovLayout from "components/Layout/Gov";
import StakeLayout from "components/Layout/stake";
import { GraphOptions } from "graphql/type";
import useGraphQLQueryOptions from "graphql/useQueries/useGraphQLQueryOptions";
import { ReactElement } from "react";
import DAOPropose from "views/gov/dao/propose";
const queryOptions: GraphOptions = {};
function DAOProposePage() {
    useGraphQLQueryOptions(queryOptions);

    return (
        <>
            <div className="ash-container text-white">
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
