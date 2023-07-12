import ICGovBoostSquare from "assets/svg/gov-boost-square.svg";
import ICGovBribeSquare from "assets/svg/gov-bribe-square.svg";
import ICGovFarmWeightSquare from "assets/svg/gov-farm-weight-square.svg";
import ICGovStatsSquare from "assets/svg/gov-stats-square.svg";
import ICGovVoteSquare from "assets/svg/gov-vote-square.svg";
import ActiveLink from "components/Link/ActiveLink";
import Scrollable from "components/Scrollable";
import { ENVIRONMENT } from "const/env";
import { FunctionComponent, SVGAttributes, memo } from "react";
type NavGovLinkProps = {
    url: string;
    label: string;
    Icon: FunctionComponent<SVGAttributes<SVGElement>>;
};
const GOV_LINKS: NavGovLinkProps[] = [
    { url: "/gov", label: "Stake Stats", Icon: ICGovStatsSquare },
    { url: "/gov/boost", label: "Farm boost", Icon: ICGovBoostSquare },
    {
        url: "/gov/farmweight",
        label: "Farm Weight Voting",
        Icon: ICGovFarmWeightSquare,
    },
    {
        url: "/gov/bribe",
        label: "Bribe",
        Icon: ICGovBribeSquare,
    },
    ...(ENVIRONMENT.NETWORK !== "mainnet"
        ? [
              {
                  url: "/gov/dao",
                  label: "Proposal Voting",
                  Icon: ICGovVoteSquare,
              },
          ]
        : []),
];

const NavGovLink = memo(function NavGovLink(props: NavGovLinkProps) {
    return (
        <ActiveLink href={props.url} exact className="shrink-0">
            {({ active }) => (
                <div
                    className={`flex items-center h-8 sm:h-12 px-6 text-xs sm:text-sm font-bold border ${
                        active ? "text-pink-600" : "text-stake-gray-500"
                    }`}
                    style={{
                        borderImageSlice: 1,
                        borderImageSource: `radial-gradient(90.48% 86.43% at 89.33% 11.52%, ${
                            active ? "rgba(255, 0, 92, 0.5) 0%" : "black"
                        }, black 100%)`,
                    }}
                >
                    <props.Icon className="w-3 h-3 mr-2" />
                    {props.label}
                </div>
            )}
        </ActiveLink>
    );
});
function NavGov() {
    return (
        <Scrollable
            className="-mx-6 px-6 sm:px-0 sm:mx-0 scrollbar-hide"
            direction="horizontal"
        >
            <div className="flex space-x-2">
                {GOV_LINKS.map((link) => {
                    return <NavGovLink key={link.url} {...link} />;
                })}
            </div>
        </Scrollable>
    );
}

export default NavGov;
