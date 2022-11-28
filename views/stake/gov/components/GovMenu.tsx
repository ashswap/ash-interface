import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useMemo } from "react";
import ICGovStatsSquare from "assets/svg/gov-stats-square.svg";
import ICGovFarmSquare from "assets/svg/gov-farm-square.svg";
import ICGovBoostSquare from "assets/svg/gov-boost-square.svg";
import ICGovVoteSquare from "assets/svg/gov-vote-square.svg";
import ICGovFarmWeightSquare from "assets/svg/gov-farm-weight-square.svg";
import ICGovBribeSquare from "assets/svg/gov-bribe-square.svg";
import ActiveLink from "components/Link/ActiveLink";
function GovMenu() {
    return (
        <div className="-mx-6 px-6 sm:px-0 sm:mx-0 scrollbar-hide flex space-x-2 overflow-auto">
            <ActiveLink href="/stake/gov" className="shrink-0">
                {({ active }) => (
                    <div
                        className={`flex items-center h-8 sm:h-12 px-6 bg-ash-dark-600 text-xs sm:text-sm font-bold ${
                            active ? "text-pink-600" : "text-stake-gray-500"
                        }`}
                    >
                        <ICGovStatsSquare className="w-3 h-3 mr-2" />
                        Stake Stats
                    </div>
                )}
            </ActiveLink>
            <ActiveLink href="/stake/gov/boost" exact className="shrink-0">
                {({ active }) => (
                    <div
                        className={`flex items-center h-8 sm:h-12 px-6 bg-ash-dark-600 text-xs sm:text-sm font-bold ${
                            active ? "text-pink-600" : "text-stake-gray-500"
                        }`}
                    >
                        <ICGovBoostSquare className="w-3 h-3 mr-2" />
                        Farm boost
                    </div>
                )}
            </ActiveLink>
            <ActiveLink href="/stake/gov/farmweight" exact className="shrink-0">
                {({ active }) => (
                    <div
                        className={`flex items-center h-8 sm:h-12 px-6 bg-ash-dark-600 text-xs sm:text-sm font-bold ${
                            active ? "text-pink-600" : "text-stake-gray-500"
                        }`}
                    >
                        <ICGovFarmWeightSquare className="w-3 h-3 mr-2" />
                        Farm Weight Voting
                    </div>
                )}
            </ActiveLink>
            <ActiveLink href="/stake/gov/bribe" exact className="shrink-0">
                {({ active }) => (
                    <div
                        className={`flex items-center h-8 sm:h-12 px-6 bg-ash-dark-600 text-xs sm:text-sm font-bold ${
                            active ? "text-pink-600" : "text-stake-gray-500"
                        }`}
                    >
                        <ICGovBribeSquare className="w-3 h-3 mr-2" />
                        Bribe
                    </div>
                )}
            </ActiveLink>
            {/* <ActiveLink href="/stake/gov/farm" exact className="shrink-0">
                {({ active }) => (
                    <div
                        className={`flex items-center h-8 sm:h-12 px-6 bg-ash-dark-600 text-xs sm:text-sm font-bold ${
                            active ? "text-pink-600" : "text-stake-gray-500"
                        }`}
                    >
                        <ICGovFarmSquare className="w-3 h-3 mr-2" />
                        Farm weight voting
                    </div>
                )}
            </ActiveLink>
            <ActiveLink href="/stake/gov/vote" exact className="shrink-0">
                {({ active }) => (
                    <div
                        className={`flex items-center h-8 sm:h-12 px-6 bg-ash-dark-600 text-xs sm:text-sm font-bold ${
                            active ? "text-pink-600" : "text-stake-gray-500"
                        }`}
                    >
                        <ICGovVoteSquare className="w-3 h-3 mr-2" />
                        Proposal Voting
                    </div>
                )}
            </ActiveLink> */}
        </div>
    );
}

export default GovMenu;
