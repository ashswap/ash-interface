import { DAPP_CONFIG } from "const/dappConfig";
import { DAOProposal } from "graphql/type.graphql";
import { shortenString } from "helper/string";
import { DAOStatus } from "interface/dao";
import moment from "moment";
import Link from "next/link";
import React, { memo } from "react";
const DAOHistoryTimeFormatter = memo(function DAOHistoryTimeFormatter({
    timestamp,
    className,
}: {
    timestamp: number;
    className?: string;
}) {
    return (
        <span className={className}>
            {moment.unix(timestamp).format("HH:mm [(UTC]Z[)] MMM DD, YYYY")}
        </span>
    );
});
type Props = Pick<
    DAOProposal,
    "created_at" | "proposer" | "executed_at" | "executed_by"
> & { status: DAOStatus; expiredTS: number; endVoteTS: number };
function DAOHistory({
    created_at,
    proposer,
    status,
    executed_at,
    executed_by,
    expiredTS,
    endVoteTS,
}: Props) {
    return (
        <div className="px-9 py-10 bg-stake-dark-300">
            <div className="mb-7.5 font-bold text-2xl text-white">History</div>
            <div className="flex flex-col gap-6">
                {executed_at > 0 && (
                    <div>
                        <div className="mb-2 font-medium text-sm text-stake-gray-500">
                            <DAOHistoryTimeFormatter timestamp={executed_at} />
                        </div>
                        <div className="px-6 py-4 bg-[#2A2A42] border border-black flex items-center justify-between gap-4">
                            <div className="font-bold text-sm text-stake-gray-500 uppercase">
                                Executed by
                            </div>
                            <Link
                                href={`${DAPP_CONFIG.explorerAddress}/accounts/${executed_by}`}
                                target="_blank"
                            >
                                <span className="font-bold text-xs text-white underline">
                                    {shortenString(executed_by)}
                                </span>
                            </Link>
                        </div>
                    </div>
                )}
                {status === "expired" && (
                    <div>
                        <div className="mb-2 font-medium text-sm text-stake-gray-500">
                            <DAOHistoryTimeFormatter timestamp={expiredTS} />
                        </div>
                        <div className="px-6 py-4 bg-[#2A2A42] border border-black flex items-center justify-between gap-4">
                            <div className="font-bold text-sm text-ash-purple-500 uppercase">
                                {status}
                            </div>
                        </div>
                    </div>
                )}
                {(status === "rejected" ||
                    status === "approved" ||
                    status === "expired") && (
                    <div>
                        <div className="mb-2 font-medium text-sm text-stake-gray-500">
                            <DAOHistoryTimeFormatter timestamp={endVoteTS} />
                        </div>
                        <div className="px-6 py-4 bg-[#2A2A42] border border-black flex items-center justify-between gap-4">
                            <div
                                className={`font-bold text-sm uppercase ${
                                    status === "rejected"
                                        ? "text-pink-600"
                                        : "text-stake-green-500"
                                }`}
                            >
                                {status === "expired" ? "approved" : status}
                            </div>
                        </div>
                    </div>
                )}
                <div>
                    <div className="mb-2 font-medium text-sm text-stake-gray-500">
                        <DAOHistoryTimeFormatter timestamp={created_at} />
                    </div>
                    <div className="px-6 py-4 bg-[#2A2A42] border border-black flex items-center justify-between gap-4">
                        <div className="font-bold text-sm text-stake-gray-500 uppercase">
                            Created By
                        </div>
                        <Link
                            href={`${DAPP_CONFIG.explorerAddress}/accounts/${proposer}`}
                            target="_blank"
                        >
                            <span className="font-bold text-xs text-white underline">
                                {shortenString(proposer)}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(DAOHistory);
