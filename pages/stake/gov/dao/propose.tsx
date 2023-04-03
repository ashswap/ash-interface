import GovLayout from "components/Layout/Gov";
import { GraphOptions } from "graphql/type";
import useGraphQLQueryOptions from "graphql/useQueries/useGraphQLQueryOptions";
import { ReactElement } from "react";
import GovMenu from "views/stake/gov/components/GovMenu";
import DAOPropose from "views/stake/gov/dao/propose";
const queryOptions: GraphOptions = {};
function DAOProposePage() {
    useGraphQLQueryOptions(queryOptions);

    return (
        <>
            <div className="ash-container text-white pt-[1.875rem]">
                <div className="mb-7">
                    <h1 className="text-pink-600 text-2xl md:text-5xl font-bold mb-7 md:mb-11">
                        <span className="text-white">Create </span>Proposal
                    </h1>
                    <GovMenu />
                </div>
                <DAOPropose />
            </div>
        </>
    );
}

DAOProposePage.getLayout = function getLayout(page: ReactElement) {
    return <GovLayout>{page}</GovLayout>;
};

export default DAOProposePage;
