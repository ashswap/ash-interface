import GovLayout from "components/Layout/Gov";
import { GraphOptions } from "graphql/type";
import useGraphQLQueryOptions from "graphql/useQueries/useGraphQLQueryOptions";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useMemo } from "react";
import GovMenu from "views/stake/gov/components/GovMenu";
import DAODetail from "views/stake/gov/dao/detail";
const queryOptions: GraphOptions = {};
function DAODetailPage() {
    useGraphQLQueryOptions(queryOptions);
    const router = useRouter();
    const proposalID = useMemo(() => +(router.query.proposalID as string ?? -1), [router]);
    useEffect(() => {
        if(proposalID === -1 || Number.isNaN(proposalID)) {
            router.replace("/stake/gov/dao");
        }
    }, [proposalID, router]);
    return (
        <>
            <div className="ash-container text-white pt-[1.875rem]">
                <div className="mb-7">
                    <h1 className="text-pink-600 text-2xl md:text-5xl font-bold mb-7 md:mb-11">
                        <span className="text-white">Ashswap </span>Proposal
                    </h1>
                    <GovMenu />
                </div>
                <DAODetail proposalID={proposalID} />
            </div>
        </>
    );
}

DAODetailPage.getLayout = function getLayout(page: ReactElement) {
    return <GovLayout>{page}</GovLayout>;
};
export default DAODetailPage;
