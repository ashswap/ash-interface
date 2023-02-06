import ICBribe from "assets/svg/bribe.svg";
import ICLock from "assets/svg/lock.svg";
import { ashswapBaseState } from "atoms/ashswap";
import { fbHasBribe, fbTotalRewardsUSD } from "atoms/farmBribeState";
import {
    fcFarmWeightChartRecordsAtom,
    fcNextFarmWeightChartRecordsAtom
} from "atoms/farmControllerState";
import { govTotalSupplyVeASH } from "atoms/govState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import Countdown from "components/Coundown";
import GlowingButton from "components/GlowingButton";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import { ASH_ESDT } from "const/tokens";
import { WEEK } from "const/ve";
import useRouteHash from "hooks/useRouteHash";
import { useScreenSize } from "hooks/useScreenSize";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import AllocationChart from "./AllocationChart";
import FarmWeightVoting from "./FarmWeightVoting";

const BribeSymbol = ({ farmAddress }: { farmAddress: string }) => {
    const nextTime = useMemo(() => {
        return moment
            .unix(Math.floor(moment().unix() / WEEK) * WEEK + WEEK)
            .format("Do MMM, YYYY");
    }, []);
    const hasBribe = useRecoilValue(fbHasBribe(farmAddress));
    const totalRewardsUSD = useRecoilValue(fbTotalRewardsUSD(farmAddress));

    return hasBribe ? (
        <CardTooltip
            autoPlacement
            content={
                <div className="w-52 p-4">
                    <div className="font-bold text-lg leading-tight text-stake-gray-500 mb-5">
                        <span className="text-pink-600">Vote</span> to earn
                        rewards
                    </div>
                    <div className="mb-4">
                        <div className="font-bold text-xs text-stake-gray-500 mb-2">
                            Total treasure
                        </div>
                        <div className="text-white">
                            <span>$</span>
                            <TextAmt
                                number={totalRewardsUSD}
                                className="font-bold"
                            />
                        </div>
                    </div>
                    <div className="px-3 py-2 bg-ash-dark-400">
                        <div className="flex items-center font-bold text-2xs mb-2">
                            <ICLock className="w-3 h-3 mr-1" />
                            <div className="underline">Lock reward</div>
                        </div>
                        <div className="font-bold text-xs text-white">
                            {nextTime}
                        </div>
                    </div>
                </div>
            }
        >
            <div>
                <ICBribe className="w-2.5 h-2.5 text-pink-600/80 colored-drop-shadow-[0px_2px_4px] colored-drop-shadow-pink-600" />
            </div>
        </CardTooltip>
    ) : (
        <></>
    );
};
function FarmWeightOverview() {
    const screens = useScreenSize();
    const ashBase = useRecoilValue(ashswapBaseState);
    const veSupply = useRecoilValue(govTotalSupplyVeASH);
    const farmWeightChartRecords = useRecoilValue(fcFarmWeightChartRecordsAtom);
    const nextFarmWeightChartRecords = useRecoilValue(
        fcNextFarmWeightChartRecordsAtom
    );
    const router = useRouter();
    const hash = useRouteHash();
    const votingRef = useRef<HTMLElement>(null);
    const defaultFarmAddress = useMemo(() => router.query.farmAddress as string || "", [router]);
    const radius = useMemo(() => {
        return screens.md ? 130 : screens.sm ? 90 : 120;
    }, [screens]);
    const currentTime = useMemo(
        () => Math.floor(moment().unix() / WEEK) * WEEK,
        []
    );
    const nextTime = useMemo(() => {
        return Math.floor(moment().unix() / WEEK) * WEEK + WEEK;
    }, []);
    const totalUsedVe = useMemo(() => {
        if (!ashBase.farmController?.farms) return new BigNumber(0);
        return ashBase.farmController.farms
            .reduce(
                (sum, f) => sum.plus(f.nextVotedPoint.bias),
                new BigNumber(0)
            )
            .div(1e18);
    }, [ashBase.farmController]);
    const totalUnusedVe = useMemo(() => {
        return BigNumber.max(veSupply.div(1e18).minus(totalUsedVe), 0);
    }, [totalUsedVe, veSupply]);
    const weeklyReward = useMemo(() => {
        if (ashBase?.rewarder?.rewardPerSec) {
            return new BigNumber(ashBase.rewarder.rewardPerSec)
                .multipliedBy(7 * 24 * 3600)
                .idiv(10 ** ASH_ESDT.decimals)
                .toNumber();
        }
        return 0;
    }, [ashBase]);

    useEffect(() => {
        console.log(hash)
        if(hash === "voting") {
            setTimeout(() => votingRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            }), 0);
        }
    }, [hash]);
    return (
        <>
            <div className="flex flex-col xl:flex-row gap-7.5">
                <div className="w-full py-11 px-7.5 bg-stake-dark-300">
                    <div className="flex justify-between space-x-4 mb-10 lg:mb-16">
                        <h2 className="font-bold text-2xl text-white leading-tight">
                            Farm weight allocation
                        </h2>
                    </div>
                    <div className="flex flex-col-reverse lg:flex-row lg:space-x-7.5 overflow-hidden">
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4 lg:w-1/4 shrink-0 mt-10 py-1 overflow-auto max-h-[18rem] lg:self-start">
                            {farmWeightChartRecords.map((f) => {
                                return (
                                    <div
                                        key={f.farmAddress}
                                        className="flex items-center"
                                    >
                                        <div
                                            className="w-4 h-4 mr-4"
                                            style={{ backgroundColor: f.color }}
                                        ></div>
                                        <div className="font-bold text-xs text-white">
                                            {f.name}
                                        </div>
                                        <div className="ml-4 -mt-1">
                                            <BribeSymbol
                                                farmAddress={f.farmAddress}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="lg:grow flex flex-col sm:flex-row justify-between overflow-hidden">
                            <div className="lg:grow-0 grow flex flex-col items-center justify-between text-center">
                                <div>
                                    <div className="font-bold text-base text-white mb-2">
                                        On voting...
                                    </div>
                                    <div className="scale-75">
                                        <Countdown timestamp={nextTime} small />
                                    </div>
                                </div>
                                <div className="w-72 h-72 sm:w-64 md:w-72 md:h-72">
                                    <AllocationChart
                                        data={nextFarmWeightChartRecords}
                                        radius={radius}
                                    />
                                </div>
                            </div>
                            <div className="hidden sm:block border-r border-r-black"></div>
                            <div className="lg:grow-0 grow mt-10 sm:mt-0 flex flex-col items-center justify-between text-center">
                                <div>
                                    <div className="font-bold text-base text-white mb-2">
                                        Current allocation
                                    </div>
                                    <div className="font-bold text-sm text-stake-gray-500">
                                        {moment
                                            .unix(currentTime)
                                            .format("Do MMM, YYYY")}{" "}
                                        -{" "}
                                        {moment
                                            .unix(nextTime)
                                            .format("Do MMM, YYYY")}
                                    </div>
                                </div>
                                <div className="w-72 h-72 sm:w-64 md:w-72 md:h-72">
                                    <AllocationChart
                                        data={farmWeightChartRecords}
                                        radius={radius}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-9">
                        <Link
                            href={{
                                hash: "voting",
                            }}
                            shallow
                        >
                            <a onClick={e => {e.preventDefault(); votingRef.current?.scrollIntoView({behavior: "smooth"})}}>
                                <GlowingButton
                                    theme="pink"
                                    className="w-full sm:w-64 h-[3.375rem] sm:h-18 font-bold text-sm sm:text-lg"
                                >
                                    Vote now!
                                </GlowingButton>
                            </a>
                        </Link>
                    </div>
                    <div className="w-full py-11">
                        <h2 className="font-bold text-2xl text-white leading-tight mb-4">
                            Current DAO stats
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="py-7 px-10 bg-ash-dark-400/30">
                                <div className="font-bold text-sm text-stake-gray-500 uppercase leading-tight mb-6">
                                    Total veash voted
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4.5 h-4.5 rounded-full bg-ash-purple-500 mr-2"></div>
                                    <TextAmt
                                        number={totalUsedVe}
                                        className="font-bold text-lg text-white"
                                        options={{ notation: "standard" }}
                                    />
                                </div>
                            </div>
                            <div className="py-7 px-10 bg-ash-dark-400/30">
                                <div className="font-bold text-sm text-stake-gray-500 uppercase leading-tight mb-6">
                                    veash unused
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4.5 h-4.5 rounded-full bg-ash-purple-500 mr-2"></div>
                                    <TextAmt
                                        number={totalUnusedVe}
                                        className="font-bold text-lg text-white"
                                        options={{ notation: "standard" }}
                                    />
                                </div>
                            </div>
                            <div className="py-7 px-10 bg-ash-dark-400/30">
                                <div className="font-bold text-sm text-stake-gray-500 uppercase leading-tight mb-6">
                                    Weekly rewards
                                </div>
                                <div className="flex items-center">
                                    <Avatar
                                        src={ASH_ESDT.logoURI}
                                        className="w-4.5 h-4.5 mr-2"
                                    />
                                    <TextAmt
                                        number={weeklyReward}
                                        className="font-bold text-lg text-white"
                                        options={{ notation: "standard" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section id="voting" ref={votingRef} className="[overflow-anchor:none]">

            <FarmWeightVoting defaultFarmAddress={defaultFarmAddress}/>
            </section>
        </>
    );
}

export default FarmWeightOverview;
