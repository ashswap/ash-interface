import BasicLayout from "components/Layout/Basic";
import GovLayout from "components/Layout/Gov";
import StakeLayout from "components/Layout/stake";
import { GraphOptions } from "graphql/type";
import useGraphQLQueryOptions from "graphql/useQueries/useGraphQLQueryOptions";
import { useRouter } from "next/router";
import { ReactElement, useMemo } from "react";
import DAODetail from "views/gov/dao/detail";
const queryOptions: GraphOptions = {};
function DAODetailPage() {
    useGraphQLQueryOptions(queryOptions);
    const router = useRouter();
    const proposalID = useMemo(
        () => +((router.query.proposalID as string) ?? -1),
        [router.query]
    );
    return (
        <>
            <div className="ash-container text-white">
                <DAODetail proposalID={proposalID} />
            </div>
        </>
    );
}

DAODetailPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <BasicLayout>
            <StakeLayout>
                <GovLayout>{page}</GovLayout>
            </StakeLayout>
        </BasicLayout>
    );
};
export default DAODetailPage;
