import { Disclosure, Transition } from "@headlessui/react";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";
import { accAddressState } from "atoms/dappState";
import BigNumber from "bignumber.js";
import Scrollable from "components/Scrollable";
import StyledMarkdown from "components/StyledMarkdown";
import TextAmt from "components/TextAmt";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { blockTimeMs, DAPP_CONFIG } from "const/dappConfig";
import { PROPOSALS_ALIAS, PROPOSALS_CONFIG } from "const/proposal";
import { gql } from "graphql-request";
import {
    DAOProposal,
    DAOProposalDetail as GqlDAOProposalDetail,
} from "graphql/type.graphql";
import { graphqlFetcher } from "helper/common";
import { ContractManager } from "helper/contracts/contractManager";
import { shortenString } from "helper/string";
import useOnTxCompleted from "hooks/useOnTxCompleted";
import useRouteHash from "hooks/useRouteHash";
import { DAOStatus } from "interface/dao";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import DAOCardBg from "../components/DAOCardBg";
import DAOResultBar from "../components/DAOResultBar";
import DAOUserVote from "../components/DAOUserVote";
import DAOVoteChart from "../components/DAOVoteChart";
import DAOVoterTable from "../components/DAOVoterTable";
import useDAOProposalComputedState from "../hooks/useDAOProposalComputedState";
import useDAOProposalMeta from "../hooks/useDAOProposalMeta";
import DAOHistory from "./DAOHistory";
const DAOCreateBribeLazy = dynamic(
    import("./DAOCreateBribe").then((m) => m.default),
    { ssr: false }
);
const DAOBribeLazy = dynamic(
    import("./DAOBribe").then((m) => m.default),
    { ssr: false }
);

const HashAnchors = [
    { hash: "description", label: "Description" },
    { hash: "voting", label: "Voting Results" },
    { hash: "voters", label: "Voters Table" },
    { hash: "chart", label: "Distribution Chart" },
];
type NonNullDAOProposalDetail = {
    proposal: DAOProposal;
    topSupporters: string[][];
    topAgainsters: string[][];
    topVoters: string[][];
    userVoteInfo: { yes_vote: BigNumber; no_vote: BigNumber };
};
function DAODetail({
    proposal,
    topSupporters,
    topAgainsters,
    topVoters,
    userVoteInfo,
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
        expiredTS,
        totalVotedPower,
    } = useDAOProposalComputedState(proposal);
    const proposalLabel = useMemo(() => {
        return (
            PROPOSALS_CONFIG[
                `${PROPOSALS_ALIAS[proposal.dest_address]}:${
                    proposal.function_name
                }`
            ] || ""
        );
    }, [proposal.dest_address, proposal.function_name]);

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

    const shareVoteYesPct = useMemo(() => {
        return userVoteInfo.yes_vote
            .multipliedBy(100)
            .div(proposal.yes_vote)
            .toNumber();
    }, [proposal.yes_vote, userVoteInfo.yes_vote]);

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
            <div className="flex flex-col gap-10 mb-7.5 lg:mb-0 shrink-0 lg:w-1/3">
                <DAOUserVote userVoteInfo={userVoteInfo} proposal={proposal} />
                {proposal?.bribes?.length > 0 && (
                    <DAOBribeLazy
                        proposal_id={proposal.proposal_id}
                        bribes={proposal.bribes}
                        sharePct={shareVoteYesPct}
                        status={status}
                    />
                )}
                {(status === "pending" || status === "active") && (
                    <DAOCreateBribeLazy proposalID={proposal.proposal_id} />
                )}
                <DAOHistory
                    {...proposal}
                    status={status}
                    endVoteTS={endVoteTS}
                    expiredTS={expiredTS}
                />
            </div>
            <div className="shrink-0 lg:w-2/3">
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
                        <hr className="my-12 border-t border-dashed border-t-ash-gray-600" />
                        {proposalLabel && (
                            <div className="mb-6 inline-block p-3 bg-ash-dark-400 font-bold text-xs text-stake-gray-500">
                                {proposalLabel}
                            </div>
                        )}
                        <section ref={descriptionRef}>
                            <h3 className="mb-6 font-bold text-2xl text-white">
                                {meta.title}
                            </h3>
                            <StyledMarkdown>{meta.description}</StyledMarkdown>
                            <div className="mt-6 break-words">
                                <span className="inline-block font-bold text-sm text-stake-gray-500">Discussion:&nbsp;</span>
                                <Link
                                    href={meta.discussionLink}
                                    target="_blank"
                                    className="inline"
                                >
                                    <span className="font-bold text-sm text-yellow-600">
                                        {meta.discussionLink}
                                    </span>
                                </Link>
                            </div>
                            {params && (
                                <Disclosure>
                                    {({ open, close }) => (
                                        <>
                                            <Disclosure.Button className="mt-6 w-full px-6 py-4 flex items-center justify-between bg-[#2A2A42] font-bold text-sm text-stake-gray-500">
                                                <span>Parameters</span>
                                                <ICChevronDown
                                                    className={`w-3 h-auto text-white transition duration-200 ${
                                                        open
                                                            ? "opacity-0"
                                                            : "delay-200"
                                                    }`}
                                                />
                                            </Disclosure.Button>
                                            <Transition
                                                show={open}
                                                enterFrom="max-h-0 opacity-0"
                                                enterTo="max-h-screen opacity-100"
                                                leaveFrom="max-h-screen opacity-100"
                                                leaveTo="max-h-0 opacity-0"
                                                className="transition-all duration-300 ease-in-out"
                                            >
                                                <Disclosure.Panel
                                                    static
                                                    className="px-6 pb-4 bg-[#2A2A42]"
                                                >
                                                    <pre>{params}</pre>
                                                    <div className="mt-6 flex justify-end">
                                                        <button
                                                            onClick={() =>
                                                                close()
                                                            }
                                                            className="-m-2 p-2"
                                                        >
                                                            <ICChevronUp className="w-3 h-auto text-white" />
                                                        </button>
                                                    </div>
                                                </Disclosure.Panel>
                                            </Transition>
                                        </>
                                    )}
                                </Disclosure>
                            )}
                            <Link
                                href={`${DAPP_CONFIG.explorerAddress}/accounts/${proposal.proposer}`}
                                target="_blank"
                                className="mt-6 inline-block"
                            >
                                <span className="font-bold text-xs text-white">
                                    by: {shortenString(proposal.proposer)}
                                </span>
                            </Link>
                        </section>
                        <hr className="my-12 border-t border-dashed border-t-ash-gray-600" />
                        <section ref={votingRef}>
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
                                        <span
                                            className={`${
                                                supportPct >= minSupportPct
                                                    ? "text-stake-green-500"
                                                    : "text-ash-purple-500"
                                            }`}
                                        >
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
                                        <span
                                            className={`${
                                                quorumPct >= minQuorumPct
                                                    ? "text-stake-green-500"
                                                    : "text-ash-purple-500"
                                            }`}
                                        >
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
                        <hr className="my-12 border-t border-dashed border-t-ash-gray-600" />
                        <section ref={votersRef}>
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
                        <hr className="my-12 border-t border-dashed border-t-ash-gray-600" />
                        <section ref={chartRef}>
                            <h2 className="mb-6 font-bold text-2xl text-white">
                                Vote Distribution Chart
                            </h2>
                            {topVoters.length > 0 ? (
                                <DAOVoteChart items={topVoters} totalPower={totalVotedPower} />
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
const defaultVoteInfo = {
    yes_vote: new BigNumber(0),
    no_vote: new BigNumber(0),
};
const predicateVoteInfo = {
    [ASHSWAP_CONFIG.dappContract.dao]: ["vote"],
};
const predicateProposalDetail = {
    [ASHSWAP_CONFIG.dappContract.dao]: ["vote", "execute"],
    [ASHSWAP_CONFIG.dappContract.daoBribe]: ["withdraw", "addRewardAmount"],
};
function DAODetailWrapper({ proposalID }: Props) {
    const address = useRecoilValue(accAddressState);
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
                          executed_by
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
                  { proposalID },
              ]
            : null;
    }, [proposalID]);
    const { data, mutate } = useSWR<{
        proposalDetail: GqlDAOProposalDetail;
    }>(query, graphqlFetcher);

    const { data: accountVotingInfo, mutate: mutateVoteInfo } = useSWR(
        [proposalID, address],
        async (proposalID, address) => {
            return await ContractManager.getDAOContract(
                ASHSWAP_CONFIG.dappContract.dao
            ).getProposalVotes(proposalID, address);
        },
        { fallbackData: defaultVoteInfo }
    );

    useOnTxCompleted(mutateVoteInfo, predicateVoteInfo);
    const mutateProposalDetail = useCallback(() => {
        setTimeout(() => {
            mutate();
        }, blockTimeMs);
    }, [mutate]);

    useOnTxCompleted(mutateProposalDetail, predicateProposalDetail);
    if (!data?.proposalDetail || !data?.proposalDetail.proposal) return null;
    const { proposal, top_supporters, top_againsters, top_voters } =
        data.proposalDetail;
    return (
        <div>
            <DAODetail
                proposal={proposal}
                topSupporters={top_supporters}
                topAgainsters={top_againsters}
                topVoters={top_voters}
                userVoteInfo={accountVotingInfo || defaultVoteInfo}
            />
        </div>
    );
}

export default DAODetailWrapper;
