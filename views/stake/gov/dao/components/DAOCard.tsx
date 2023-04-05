import { DAOStatus } from "interface/dao";
import { memo, useMemo } from "react";

import { Transition } from "@headlessui/react";
import Countdown from "components/Coundown";
import TextAmt from "components/TextAmt";
import { DAOProposal } from "graphql/type.graphql";
import moment from "moment";
import Link from "next/link";
import { DAOThemeTextClassName } from "../const/theme";
import useDAOProposalComputedState from "../hooks/useDAOProposalComputedState";
import useDAOProposalMeta from "../hooks/useDAOProposalMeta";
import DAOCardBg from "./DAOCardBg";
import DAOResultBar from "./DAOResultBar";

const STATUS_LABEL: Record<DAOStatus, string> = {
    active: "Active - Can vote",
    rejected: "Rejected",
    executed: "Executed",
    pending: "Pending",
    approved: "Passed",
    expired: "Expired",
};
type DAOCardProps = {
    proposal: DAOProposal;
    detail?: boolean;
};
function DAOCard({ detail, proposal }: DAOCardProps) {
    const meta = useDAOProposalMeta(proposal.ipfs_hash || "");
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
        canExecuteTS,
        canExecute,
    } = useDAOProposalComputedState(proposal);
    const startVoteTSFmt = useMemo(() => {
        return moment.unix(startVoteTS).format("HH:mm [(UTC]Z[)] MMM Do, YYYY");
    }, [startVoteTS]);
    const canExecuteTSFmt = useMemo(() => {
        return moment
            .unix(canExecuteTS)
            .format("HH:mm [(UTC]Z[)] MMM Do, YYYY");
    }, [canExecuteTS]);
    return (
        <Link
            href={{
                pathname: "/stake/gov/dao/detail",
                query: { proposalID: proposal.proposal_id },
            }}
        >
            <div className="group relative px-6 sm:px-12 py-5 sm:py-9">
                <DAOCardBg
                    status={status}
                    clipClassName="clip-corner-4 clip-corner-br group-hover:bg-stake-dark-300 group-active:bg-ash-dark-400"
                />
                <div className="h-full relative flex flex-col justify-between">
                    <div>
                        <div className="flex mb-6 sm:mb-12 gap-1">
                            <div className="relative px-3 sm:px-4 py-0.5 sm:py-1">
                                <div
                                    className={`absolute inset-0 skew-x-[-10deg] bg-current ${DAOThemeTextClassName[status]}`}
                                ></div>
                                <div
                                    className={`relative font-bold text-xs sm:text-base capitalize ${
                                        status === "active"
                                            ? "text-white"
                                            : "text-ash-dark-400"
                                    }`}
                                >
                                    {STATUS_LABEL[status]}
                                </div>
                            </div>
                            {status === "approved" && (
                                <div className="relative px-3 sm:px-4 py-0.5 sm:py-1">
                                    <div
                                        className={`absolute inset-0 skew-x-[-10deg] bg-ash-dark-400`}
                                    ></div>
                                    <div className="relative font-bold text-xs sm:text-base text-white capitalize">
                                        {canExecute ? (
                                            <>
                                                Ready for{" "}
                                                <span className="text-stake-green-500 underline">
                                                    Execute
                                                </span>
                                            </>
                                        ) : (
                                            "On Queue"
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mb-6 font-bold text-2xl text-stake-gray-500">
                            #{proposal.proposal_id}
                        </div>
                        <div className="mb-4 font-bold text-lg text-white">
                            {meta.title}
                        </div>
                        <p className="font-bold text-xs text-stake-gray-500 line-clamp-2">
                            {meta.description}
                        </p>
                    </div>
                    <Transition
                        show={detail}
                        enter="transition-all duration-300 ease-in-out"
                        enterFrom="max-h-0 opacity-0 mt-0"
                        enterTo="max-h-screen opacity-100 mt-12"
                        leave="transition-all duration-300 ease-in-out"
                        leaveFrom="max-h-screen opacity-100 mt-12"
                        leaveTo="max-h-0 opacity-0 mt-0"
                        className="mt-12"
                    >
                        <div>
                            <DAOResultBar
                                yes={yesVote}
                                no={noVote}
                                requiredSupportPct={minSupportPct}
                            />
                        </div>
                        <div className="mt-12 space-y-4">
                            <div className="flex items-center">
                                <div className="flex items-center mr-8">
                                    <div className="mr-2 font-bold text-sm text-stake-gray-500">
                                        Support
                                    </div>
                                    <div className="bg-ash-dark-400 py-1 px-2 rounded-full font-bold text-xs text-ash-gray-600">
                                        {">"}{" "}
                                        <TextAmt
                                            number={minSupportPct}
                                            options={{ isIntegerAuto: true }}
                                        />
                                        % required
                                    </div>
                                </div>
                                <div
                                    className={`font-bold text-sm ${
                                        supportPct >= minSupportPct
                                            ? "text-stake-green-500"
                                            : "text-ash-purple-500"
                                    }`}
                                >
                                    <TextAmt
                                        number={supportPct}
                                        options={{ isIntegerAuto: true }}
                                    />
                                    %
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex items-center mr-8">
                                    <div className="mr-2 font-bold text-sm text-stake-gray-500">
                                        Quorum
                                    </div>
                                    <div className="bg-ash-dark-400 py-1 px-2 rounded-full font-bold text-xs text-ash-gray-600">
                                        {">"}{" "}
                                        <TextAmt
                                            number={minQuorumPct}
                                            options={{ isIntegerAuto: true }}
                                        />
                                        % required
                                    </div>
                                </div>
                                <div
                                    className={`font-bold text-sm ${
                                        quorumPct >= minQuorumPct
                                            ? "text-stake-green-500"
                                            : "text-ash-purple-500"
                                    }`}
                                >
                                    <TextAmt
                                        number={quorumPct}
                                        options={{ isIntegerAuto: true }}
                                    />
                                    %
                                </div>
                            </div>
                        </div>
                        <div className="mt-12">
                            {status === "active" && (
                                <Countdown timestamp={endVoteTS} small />
                            )}
                            {status === "pending" && (
                                <div>
                                    <div className="mb-2 font-bold text-lg text-white">
                                        This proposal can be voted on
                                    </div>
                                    <div className="font-bold text-sm text-stake-gray-500">
                                        {startVoteTSFmt}
                                    </div>
                                </div>
                            )}
                            {status === "approved" && (
                                <div>
                                    <div className="mb-2 font-bold text-lg text-white">
                                        Can be executed at
                                    </div>
                                    <div className="font-bold text-sm text-stake-gray-500">
                                        {canExecuteTSFmt}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Transition>
                </div>
            </div>
        </Link>
    );
}

export default memo(DAOCard);
