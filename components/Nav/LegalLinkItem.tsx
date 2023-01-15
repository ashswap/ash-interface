import ICNewTabRound from "assets/svg/new-tab-round.svg";
import { LEGAL_LINKS } from "const/link";
import { Unarray } from "interface/utilities";
import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";
type props = Unarray<typeof LEGAL_LINKS> & { className?: string };
function LegalLinkItem({ url, iconClassName, name, className }: props) {
    const wrapCalssName = useMemo(() => {
        const defaultClassName =
            "py-2.5 px-3 bg-ash-dark-400 hover:bg-stake-dark-400 flex items-center justify-between space-x-1 text-stake-gray-500 transition-all duration-300";
        return twMerge(defaultClassName, className);
    }, [className]);
    return (
        <a href={url} target="_blank" rel="noreferrer" className="block">
            <div className={wrapCalssName}>
                <div className="flex items-center space-x-4 overflow-hidden">
                    <svg
                        width="18"
                        height="9"
                        viewBox="0 0 18 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={twMerge("shrink-0", iconClassName)}
                    >
                        <path
                            d="M17.5 5.88233L12.0369 0.000385219L6.57376 0.000385154L1.01366e-07 2.26795e-05L7.39617 8.5L17.5 8.50037L17.5 5.88233Z"
                            fill="currentColor"
                        />
                    </svg>
                    <div className="font-medium text-sm truncate">{name}</div>
                </div>
                <ICNewTabRound className="w-3.5 h-auto shrink-0" />
            </div>
        </a>
    );
}

export default LegalLinkItem;
