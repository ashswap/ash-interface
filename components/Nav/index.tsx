import ICChart from "assets/svg/chart.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICFarm from "assets/svg/farm.svg";
import ICNewTab from "assets/svg/new-tab.svg";
import ICPool from "assets/svg/pool.svg";
import ICSocial from "assets/svg/social.svg";
import ICStake from "assets/svg/stake.svg";
import ICSwap from "assets/svg/swap.svg";
import BaseTooltip from "components/BaseTooltip";
import { useRouter } from "next/router";
import NavLink from "./NavLink";
import { SocialMenuContent } from "./SocialMenu";

const Nav = () => {
    const router = useRouter();

    return (
        <nav className="flex items-center gap-2">
            <NavLink href="/swap">
                <ICSwap className="w-4 h-auto" />
                <span>Swap</span>
            </NavLink>
            <NavLink href="/pool">
                <ICPool className="w-4 h-auto" />
                <span>Pool</span>
            </NavLink>
            <NavLink href="/farms">
                <ICFarm className="w-4 h-auto" />
                <span>Farm</span>
            </NavLink>
            <NavLink href="/gov">
                <ICStake className="-mt-0.5 w-4 h-auto" />
                <span>Governance</span>
            </NavLink>
            <NavLink href="/info" target="_blank">
                <ICChart className="w-4 h-auto" />
                <span className="inline-flex items-center gap-1 md:gap-2">
                    <span>Analytic</span>
                    <ICNewTab className="w-2 md:w-3 h-auto" />
                </span>
            </NavLink>
            <BaseTooltip
                strategy="fixed"
                placement="bottom"
                content={
                    <div className="bg-ash-dark-600 p-8 min-w-[22.5rem]">
                        <SocialMenuContent />
                    </div>
                }
            >
                <button>
                    <NavLink href="." onClick={e => e.preventDefault()}>
                        <ICSocial className="-mt-0.5 w-4 h-auto" />
                        <span className="inline-flex items-center gap-1 md:gap-2">
                            <span>More</span>
                            <ICChevronDown className="md:-mt-0.5 w-2 md:w-3 h-auto" />
                        </span>
                    </NavLink>
                </button>
            </BaseTooltip>
        </nav>
    );
};

export default Nav;
