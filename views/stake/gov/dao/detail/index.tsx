import BigNumber from "bignumber.js";
import { GetTransactionsByHashesReturnType } from "components/DappCoreCustom/getTransactionsByHashes";
import Scrollable from "components/Scrollable";
import TextAmt from "components/TextAmt";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { gql } from "graphql-request";
import {
    DAOProposal,
    DAOProposalDetail as GqlDAOProposalDetail
} from "graphql/type.graphql";
import { graphqlFetcher } from "helper/common";
import emitter from "helper/emitter";
import { shortenString } from "helper/string";
import useRouteHash from "hooks/useRouteHash";
import { DAOStatus } from "interface/dao";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import useSWR from "swr";
import DAOCardBg from "../components/DAOCardBg";
import DAOResultBar from "../components/DAOResultBar";
import DAOUserVote from "../components/DAOUserVote";
import DAOVoteChart from "../components/DAOVoteChart";
import DAOVoterTable from "../components/DAOVoterTable";
import useDAOProposalComputedState from "../hooks/useDAOProposalComputedState";
import useDAOProposalMeta from "../hooks/useDAOProposalMeta";

const HashAnchors = [
    { hash: "description", label: "Description" },
    { hash: "voting", label: "Voting Results" },
    { hash: "voters", label: "Voters Table" },
    { hash: "chart", label: "Distribution Charts" },
];
type NonNullDAOProposalDetail = {
    proposal: DAOProposal;
    topSupporters: string[][];
    topAgainsters: string[][];
    topVoters: string[][];
};
function DAODetail({
    proposal,
    topSupporters,
    topAgainsters,
    topVoters,
}: NonNullDAOProposalDetail) {
    const routeHash = useRouteHash();
    const descriptionRef = useRef<HTMLElement>(null);
    const votingRef = useRef<HTMLElement>(null);
    const votersRef = useRef<HTMLElement>(null);
    const chartRef = useRef<HTMLElement>(null);

    const ipfsHash = useMemo(() => proposal?.ipfs_hash || "", [proposal]);
    const meta = useDAOProposalMeta(ipfsHash);
    const {
        status,
        minQuorumPct,
        minSupportPct,
        supportPct,
        quorumPct,
        startVoteTS,
        endVoteTS,
        yesVote,
        noVote,
    } = useDAOProposalComputedState(proposal);

    const params = useMemo(() => {
        if (proposal?.arguments) {
            const args = JSON.parse(proposal.arguments);
            delete args["argument_length"];
            return Object.entries(args)
                .map(([k, v]) => `${k}: ${v}`)
                .join("\n");
        }
        return "";
    }, [proposal]);

    const topRecords = useMemo(() => {
        return [
            ...topSupporters.map((v) => ({
                address: v[0],
                power: new BigNumber(v[1]).div(1e18).toNumber(),
                isSupport: true,
            })),
            ...topAgainsters.map((v) => ({
                address: v[0],
                power: new BigNumber(v[1]).div(1e18).toNumber(),
                isSupport: false,
            })),
        ]
            .sort((x, y) => y.power - x.power)
            .slice(0, 10);
    }, [topAgainsters, topSupporters]);

    useEffect(() => {
        const ref = {
            description: descriptionRef,
            voting: votingRef,
            voters: votersRef,
            chart: chartRef,
        }[routeHash];
        if (ref) {
            setTimeout(() => {
                ref.current?.scrollIntoView({ behavior: "smooth" });
            }, 0);
        }
    }, [routeHash]);

    return (
        <div className="lg:flex gap-7.5">
            <div className="mb-7.5 lg:mb-0 lg:w-1/3">
                <DAOUserVote proposal={proposal} />
            </div>
            <div className="lg:w-2/3">
                <div className="relative p-9 sm:p-12">
                    <DAOCardBg
                        status={proposal.state as DAOStatus}
                        clipClassName="bg-stake-dark-300"
                    />
                    <div className="relative">
                        <div className="mb-12 font-bold text-2xl text-stake-gray-500">
                            #{proposal.proposal_id}
                        </div>
                        <Scrollable
                            className="-mx-9 px-9 sm:mx-0 sm:px-0 mb-12 scrollbar-hide"
                            direction="horizontal"
                        >
                            <div className="flex items-center gap-x-6">
                                {HashAnchors.map(({ hash, label }, i) => (
                                    <Link
                                        key={hash}
                                        href={{ hash }}
                                        className={`shrink-0`}
                                    >
                                        <span
                                            className={`font-bold text-sm ${
                                                hash === routeHash ||
                                                (!routeHash && i === 0)
                                                    ? "text-white"
                                                    : "text-stake-gray-500"
                                            }`}
                                        >
                                            {label}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </Scrollable>
                        <section ref={descriptionRef} className="mb-12">
                            <div
                                className="mb-4 font-bold text-[3.5rem] text-ash-gray-600 uppercase"
                                style={{
                                    WebkitTextFillColor: "transparent",
                                    WebkitTextStroke: "1px currentColor",
                                }}
                            >
                                {proposal.state}
                            </div>
                            <h3 className="mb-4 font-bold text-2xl text-white">
                                {meta.title}
                            </h3>
                            <ReactMarkdown className="font-bold text-sm text-stake-gray-500">
                                {meta.description}
                            </ReactMarkdown>
                            {params && (
                                <>
                                    <h4 className="mt-4 mb-2 font-bold text-base text-white">
                                        Parameters
                                    </h4>
                                    <pre className="p-6 bg-ash-dark-400/30">
                                        {params}
                                    </pre>
                                </>
                            )}
                            <div className="mt-4 font-bold text-xs text-white">
                                by: {shortenString(proposal.proposer)}
                            </div>
                        </section>
                        <section ref={votingRef} className="mb-12">
                            <h2 className="mb-12 font-bold text-2xl text-white">
                                Voting Results
                            </h2>
                            <DAOResultBar
                                yes={yesVote}
                                no={noVote}
                                requiredSupportPct={minSupportPct}
                                detail
                            />
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="p-3 flex flex-col items-center justify-between gap-6 border border-black">
                                    <div className="font-bold text-sm text-white">
                                        Support
                                    </div>
                                    <div className="font-bold text-sm">
                                        <span className="text-stake-green-500">
                                            <TextAmt number={supportPct} />
                                            %&nbsp;
                                        </span>
                                        <span className="text-ash-gray-600">
                                            ({">"}
                                            <TextAmt number={minSupportPct} />%
                                            required)
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3 flex flex-col items-center justify-between gap-6 border border-black">
                                    <div className="font-bold text-sm text-white">
                                        Quorum
                                    </div>
                                    <div className="font-bold text-sm">
                                        <span className="text-stake-green-500">
                                            <TextAmt number={quorumPct} />
                                            %&nbsp;
                                        </span>
                                        <span className="text-ash-gray-600">
                                            ({">"}
                                            <TextAmt number={minQuorumPct} />%
                                            required)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section ref={votersRef} className="mb-12">
                            <h2 className="mb-6 font-bold text-2xl text-white">
                                Voters Table
                            </h2>
                            {topRecords.length > 0 ? (
                                <div className="-mx-9 px-9 sm:mx-0 sm:px-0 overflow-auto">
                                    <div className="min-w-[30rem]">
                                        <DAOVoterTable items={topRecords} />
                                    </div>
                                </div>
                            ) : (
                                <div className="py-10 font-bold text-sm text-stake-gray-500 text-center">
                                    No Information
                                </div>
                            )}
                        </section>
                        <section ref={chartRef}>
                            <h2 className="mb-6 font-bold text-2xl text-white">
                                Vote Distribution Chart
                            </h2>
                            {topVoters.length > 0 ? (
                                <DAOVoteChart items={topVoters} />
                            ) : (
                                <div className="py-10 font-bold text-sm text-stake-gray-500 text-center">
                                    No Information
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
type Props = {
    proposalID: number;
};
function DAODetailWrapper({ proposalID }: Props) {
    const query = useMemo(() => {
        return proposalID
            ? [
                  gql`
                      query DAOProposalQuery($proposalID: Int!) {
                          proposalDetail(id: $proposalID) {
                              proposal {
                                  ...allProposalProps
                              }
                              top_supporters
                              top_againsters
                              top_voters
                          }
                      }
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
                      }
                  `,
                  { proposalID },
              ]
            : null;
    }, [proposalID]);
    const { data, mutate } = useSWR<{
        proposalDetail: GqlDAOProposalDetail;
    }>(query, graphqlFetcher);

    useEffect(() => {
        const onVoteSuccess = (txs: GetTransactionsByHashesReturnType) => {
            if(txs.some(tx => tx.meta?.receiver === ASHSWAP_CONFIG.dappContract.dao && tx.meta?.functionName === 'vote')){
                mutate();
            }
        };
        emitter.on("onCheckBatchResult", onVoteSuccess);
        return () => {
            emitter.off("onCheckBatchResult", onVoteSuccess);
        };
    }, [mutate]);

    if (!data?.proposalDetail || !data?.proposalDetail.proposal) return null;
    const { proposal, top_supporters, top_againsters, top_voters } =
        data.proposalDetail;
    return (
        <DAODetail
            proposal={proposal}
            topSupporters={top_supporters}
            topAgainsters={top_againsters}
            topVoters={top_voters}
        />
    );
}

export default DAODetailWrapper;
