import { formatAmount } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import BoostBar, { BoostBarProps } from ".";
import ICGovBoost from "assets/svg/gov-boost.svg";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { useOnboarding } from "hooks/useOnboarding";
import Link from "next/link";
import useRouteModal from "hooks/useRouteModal";
const AdvanceBoostBar = ({
    onboardMaxBoost,
    farmAddress,
    ...props
}: Omit<BoostBarProps, "min" | "height"> & {
    onboardMaxBoost?: boolean;
    farmAddress?: string;
}) => {
    const max = props.max || 2.5;
    const MAX = 2.5;
    const MIN = 1;
    const { isMobile } = useScreenSize();
    const [onboardingMaxBoost, setOnboardedMaxBoost] =
        useOnboarding("farm_max_boost");
    const { encode } = useRouteModal("calc_boost");
    return (
        <div className="flex items-center">
            <div className="grow">
                <BoostBar
                    {...props}
                    height={isMobile ? 36 : 42}
                    min={MIN}
                    max={max}
                >
                    <div className="flex items-center justify-between px-6 text-white h-full font-bold text-xs">
                        {(props.value || 1) >= max ? (
                            <div>Max</div>
                        ) : (
                            <div className="flex items-center">
                                <span className="mr-1">
                                    x{formatAmount(props.value)}
                                </span>
                                <ICGovBoost className="-mt-0.5" />
                            </div>
                        )}
                        <div className="flex items-center">
                            <span className="mr-1">x{formatAmount(max)}</span>
                            <ICGovBoost className="-mt-0.5" />
                        </div>
                    </div>
                </BoostBar>
            </div>
            <div
                style={{
                    width: `${((MAX - max) * 100) / (MAX - MIN)}%`,
                    maxWidth: `calc(100% - 11rem)`,
                    height: `${(isMobile ? 34 : 40) + (props.disabled ? 2 : 0) }px`,
                    background:
                        "transparent repeating-linear-gradient( 45deg, rgba(117, 115, 145, 0.3), rgba(117, 115, 145, 0.3) 4px, transparent 2px, transparent 7px )",
                }}
                className={`shrink-0 skew-x-[-33deg] -translate-x-3 relative ${props.veLine ? "-translate-y-0.5" : "translate-y-2.5"}`}
            >
                <OnboardTooltip
                    disabled={!onboardMaxBoost}
                    activeOnHover
                    placement="bottom-start"
                    open={onboardingMaxBoost}
                    onArrowClick={() => setOnboardedMaxBoost(true)}
                    content={
                        <OnboardTooltip.Panel>
                            <div className="text-sm text-stake-gray-500 font-bold px-5 my-3">
                                Max boost possible shows the maximum of boost
                                that you can reach. It&apos;s not always be 2.5
                                times, go{" "}
                                <Link
                                    href={{
                                        pathname: "/stake/gov/boost",
                                        query: {
                                            p: encode({
                                                farmAddress,
                                            }),
                                        },
                                    }}
                                >
                                    <a>
                                        <span className="text-stake-green-500 underline">
                                            calculator
                                        </span>
                                    </a>
                                </Link>{" "}
                                or{" "}
                                <span className="text-stake-green-500 underline">
                                    Boost Guide
                                </span>{" "}
                                to learn more.
                            </div>
                        </OnboardTooltip.Panel>
                    }
                >
                    <div className="w-full h-full"></div>
                </OnboardTooltip>
            </div>
        </div>
    );
};

export default AdvanceBoostBar;
