import GovLayout from "components/Layout/Gov";
import { GraphOptions } from "graphql/type";
import useGraphQLQueryOptions from "graphql/useQueries/useGraphQLQueryOptions";
import { ReactElement } from "react";
import GovMenu from "views/stake/gov/components/GovMenu";
import DAOOverview from "views/stake/gov/dao/DAOOverview";
const queryOptions: GraphOptions = {};
function DAOPage() {
    useGraphQLQueryOptions(queryOptions);
    
    return (
        <>
            <div className="ash-container text-white pt-[1.875rem]">
                <div className="mb-20">
                    <h1 className="text-pink-600 text-2xl md:text-5xl font-bold mb-7 md:mb-11">
                        <span className="text-white">Ashswap </span>Proposal
                    </h1>
                    <GovMenu />
                </div>
                <DAOOverview />
            </div>
        </>
    );
}

DAOPage.getLayout = function getLayout(page: ReactElement) {
    return <GovLayout>{page}</GovLayout>;
};

export default DAOPage;
