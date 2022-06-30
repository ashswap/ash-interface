import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useMemo } from "react";
import ICGovStatsSquare from "assets/svg/gov-stats-square.svg";
import ICGovFarmSquare from "assets/svg/gov-farm-square.svg";
import ICGovBoostSquare from "assets/svg/gov-boost-square.svg";
import ICGovVoteSquare from "assets/svg/gov-vote-square.svg";
import ActiveLink from "components/Link/ActiveLink";
function GovMenu() {
    return (
        <div className="flex space-x-2">
            <ActiveLink href="/stake/gov">
                {({ active }) => (
                    <div
                        className={`flex items-center h-12 px-6 bg-ash-dark-600 text-sm font-bold ${
                            active ? "text-pink-600" : "text-stake-gray-500"
                        }`}
                    >
                        <ICGovStatsSquare className="w-3 h-3 mr-2" />
                        Stake Stats
                    </div>
                )}
            </ActiveLink>
            <ActiveLink href="/stake/gov/boost" exact>
                {({ active }) => (
                    <div
                        className={`flex items-center h-12 px-6 bg-ash-dark-600 text-sm font-bold ${
                            active ? "text-pink-600" : "text-stake-gray-500"
                        }`}
                    >
                        <ICGovBoostSquare className="w-3 h-3 mr-2" />
                        Farm boost
                    </div>
                )}
            </ActiveLink>
            <ActiveLink href="/stake/gov/farm" exact>
                {({ active }) => (
                    <div
                        className={`flex items-center h-12 px-6 bg-ash-dark-600 text-sm font-bold ${
                            active ? "text-pink-600" : "text-stake-gray-500"
                        }`}
                    >
                        <ICGovFarmSquare className="w-3 h-3 mr-2" />
                        Farm weight voting
                    </div>
                )}
            </ActiveLink>
            <ActiveLink href="/stake/gov/vote" exact>
                {({ active }) => (
                    <div
                        className={`flex items-center h-12 px-6 bg-ash-dark-600 text-sm font-bold ${
                            active ? "text-pink-600" : "text-stake-gray-500"
                        }`}
                    >
                        <ICGovVoteSquare className="w-3 h-3 mr-2" />
                        Proposal Voting
                    </div>
                )}
            </ActiveLink>
        </div>
    );
}

export default GovMenu;
