import {
    DAOFilterOpenProposalAtom,
    DAOFilterStatusClosedOptionsAtom
} from "atoms/daoState";
import Pagination from "components/Pagination";
import { gql } from "graphql-request";
import { DAOProposal, PaginationProposals } from "graphql/type.graphql";
import { graphqlFetcher } from "helper/common";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import DAOFilter from "./components/DAOFilter";
import DAOList from "./components/DAOList";
function DAOOverview() {
    const [index, setIndex] = useState(0);
    const [size, setSize] = useState(10);
    const [openedDAOProposals, setOpenedDAOProposals] = useState<DAOProposal[]>(
        []
    );
    const [closedDAOProposals, setClosedDAOProposals] = useState<DAOProposal[]>(
        []
    );
    const isFilteredOpen = useRecoilValue(DAOFilterOpenProposalAtom);
    const filterDAOStatusClosedOpttions = useRecoilValue(
        DAOFilterStatusClosedOptionsAtom
    );
    const filterDAOStatus = useMemo(
        () =>
            isFilteredOpen
                ? []
                : filterDAOStatusClosedOpttions
                      .filter((opt) => opt.checked)
                      .map((opt) => opt.value),
        [filterDAOStatusClosedOpttions, isFilteredOpen]
    );
    const query = useMemo(() => {
        return isFilteredOpen
            ? gql`
                  query DAOListQuery {
                      openedDAOProposals {
                          ...allProposalProps
                      }
                  }
              `
            : gql`
                  query DAOListQuery(
                      $filterDAOStatus: [String!]
                      $limit: Int!
                      $offset: Int!
                  ) {
                      closedDAOProposals(
                          limit: $limit
                          offset: $offset
                          states: $filterDAOStatus
                      ) {
                          total
                          proposals {
                              ...allProposalProps
                          }
                      }
                  }
              `;
    }, [isFilteredOpen]);
    const { data } = useSWR<{
        openedDAOProposals: DAOProposal[];
        closedDAOProposals: PaginationProposals;
    }>(
        [
            gql`
                ${query}
                fragment allProposalProps on DAOProposal {
                    dest_address
                    function_name
                    arguments
                    min_power_for_propose
                    min_time_for_propose
                    min_support_pct
                    min_quorum_pct
                    voting_time_limit
                    queue_time_limit
                    execute_time_limit
                    created_at
                    executed_at
                    ipfs_hash
                    no_vote
                    proposal_id
                    proposer
                    state
                    total_supply
                    yes_vote
                    bribes {
                        token_id
                        reward_amount
                    }
                }
            `,
            { filterDAOStatus, limit: size, offset: index * size },
        ],
        graphqlFetcher
    );

    const proposals = useMemo(() => {
        return (isFilteredOpen ? openedDAOProposals : closedDAOProposals) || [];
    }, [isFilteredOpen, openedDAOProposals, closedDAOProposals]);

    useEffect(() => {
        if (data && data.openedDAOProposals)
            setOpenedDAOProposals(data.openedDAOProposals);
        if (data && data.closedDAOProposals?.proposals)
            setClosedDAOProposals(data.closedDAOProposals.proposals);
    }, [data]);
    useEffect(() => {
        if(isFilteredOpen){
            setIndex(0);
        }
    }, [isFilteredOpen])

    return (
        <>
            <div className="mb-14">
                <DAOFilter />
            </div>
            <div className="space-y-24">
                <DAOList
                    proposals={proposals}
                    pagination={
                        !isFilteredOpen && proposals.length > 0 && (
                            <Pagination
                                total={data?.closedDAOProposals?.total}
                                size={size}
                                index={index}
                                onChangeIndex={(i) => setIndex(i)}
                                className="bg-stake-dark-400"
                            />
                        )
                    }
                />
            </div>
        </>
    );
}

export default DAOOverview;
