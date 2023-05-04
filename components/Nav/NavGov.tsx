import ICGovBoostSquare from "assets/svg/gov-boost-square.svg";
import ICGovBribeSquare from "assets/svg/gov-bribe-square.svg";
import ICGovFarmWeightSquare from "assets/svg/gov-farm-weight-square.svg";
import ICGovStatsSquare from "assets/svg/gov-stats-square.svg";
import ICGovVoteSquare from "assets/svg/gov-vote-square.svg";
import ActiveLink from "components/Link/ActiveLink";
import Scrollable from "components/Scrollable";
import { ENVIRONMENT } from "const/env";
function NavGov() {
    return (
        <Scrollable
            className="-mx-6 px-6 sm:px-0 sm:mx-0 scrollbar-hide"
            direction="horizontal"
        >
            <div className="flex space-x-2">
                <ActiveLink href="/gov/stake" exact className="shrink-0">
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
                <ActiveLink href="/gov/boost" exact className="shrink-0">
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
                <ActiveLink
                    href="/gov/farmweight"
                    exact
                    className="shrink-0"
                >
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
                {ENVIRONMENT.NETWORK === "devnet" && (
                    <ActiveLink href="/gov/dao" className="shrink-0">
                        {({ active }) => (
                            <div
                                className={`flex items-center h-8 sm:h-12 px-6 bg-ash-dark-600 text-xs sm:text-sm font-bold ${
                                    active
                                        ? "text-pink-600"
                                        : "text-stake-gray-500"
                                }`}
                            >
                                <ICGovVoteSquare className="w-3 h-3 mr-2" />
                                Proposal Voting
                            </div>
                        )}
                    </ActiveLink>
                )}
                {ENVIRONMENT.NETWORK === "devnet" && (
                    <ActiveLink
                        href="/gov/bribe"
                        exact
                        className="shrink-0"
                    >
                        {({ active }) => (
                            <div
                                className={`flex items-center h-8 sm:h-12 px-6 bg-ash-dark-600 text-xs sm:text-sm font-bold ${
                                    active
                                        ? "text-pink-600"
                                        : "text-stake-gray-500"
                                }`}
                            >
                                <ICGovBribeSquare className="w-3 h-3 mr-2" />
                                Bribe
                            </div>
                        )}
                    </ActiveLink>
                )}
            </div>
        </Scrollable>
    );
}

export default NavGov;
