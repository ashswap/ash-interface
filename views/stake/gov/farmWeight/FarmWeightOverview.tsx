import ICBribe from "assets/svg/bribe.svg";
import ICLock from "assets/svg/lock.svg";
import { ashswapBaseState } from "atoms/ashswap";
import { fbFarmSelector, fbTotalRewardsUSD } from "atoms/farmBribeState";
import {
    fcFarmWeightChartRecordsAtom,
    fcNextFarmWeightChartRecordsAtom,
} from "atoms/farmControllerState";
import { govTotalSupplyVeASH } from "atoms/govState";
import BigNumber from "bignumber.js";
import Countdown from "components/Coundown";
import GlowingButton from "components/GlowingButton";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import { WEEK } from "const/ve";
import useFCCheckpoint from "hooks/useFarmControllerContract/useCheckpoint";
import useFCApplyWeight from "hooks/useFarmControllerContract/useFCApplyWeight";
import useRouteModal from "hooks/useRouteModal";
import { useScreenSize } from "hooks/useScreenSize";
import moment from "moment";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import AllocationChart from "./AllocationChart";

const BribeSymbol = ({ farmAddress }: { farmAddress: string }) => {
    const fbFarm = useRecoilValue(fbFarmSelector(farmAddress));
    const nextTime = useMemo(() => {
        return moment
            .unix(Math.floor(moment().unix() / WEEK) * WEEK + WEEK)
            .format("Do MMM, YYYY");
    }, []);
    const hasBribe = useMemo(() => {
        return fbFarm?.rewards.some((r) =>
            new BigNumber(r.rewardPerVote).gt(0)
        );
    }, [fbFarm]);
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
    const { encode } = useRouteModal("farm_weight_voting");
    const [timeLeft, setTimeLeft] = useState("");
    const screens = useScreenSize();
    const ashBase = useRecoilValue(ashswapBaseState);
    const veSupply = useRecoilValue(govTotalSupplyVeASH);
    const farmWeightChartRecords = useRecoilValue(fcFarmWeightChartRecordsAtom);
    const nextFarmWeightChartRecords = useRecoilValue(
        fcNextFarmWeightChartRecordsAtom
    );
    const { checkpoint } = useFCCheckpoint(false);
    const { applyRelativeWeight } = useFCApplyWeight(false);
    const radius = useMemo(() => {
        return screens.lg ? 200 : screens.sm ? 150 : 100;
    }, [screens]);
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
    const canCheckpoint = useMemo(() => {
        if (!ashBase.farmController) return false;
        return ashBase.farmController.timeCheckpoint < nextTime;
    }, [ashBase.farmController, nextTime]);
    const canApplyRelativeWeight = useMemo(() => {
        if (!ashBase.farmController) return false;
        return (
            ashBase.farmController.timeCheckpoint === nextTime &&
            ashBase.farmController.timeApply < nextTime
        );
    }, [ashBase.farmController, nextTime]);
    useEffect(() => {
        const func = () => {
            const duration = moment.duration(
                moment.unix(nextTime).diff(moment())
            );
            if (duration.milliseconds() > 0) {
                const d = Math.floor(duration.asDays());
                const h = duration.hours();
                const m = duration.minutes();
                setTimeLeft(`${d}D ${h}H ${m}M`);
            } else {
                setTimeLeft(`0D 0H 0M`);
            }
        };
        func();
        const interval = setInterval(func, 30000);
        return () => {
            clearInterval(interval);
        };
    }, [nextTime]);

    return (
        <>
            <div className="flex flex-col xl:flex-row gap-7.5">
                <div className="w-full xl:w-2/3 py-11 px-7.5 bg-stake-dark-300">
                    <div className="flex justify-between space-x-4">
                        <h2 className="font-bold text-2xl text-white leading-tight mb-4">
                            Farm weight allocation
                        </h2>
                        <div className="flex space-x-2">
                            <GlowingButton
                                theme="pink"
                                className="px-5 py-3 font-bold text-sm"
                                disabled={!canCheckpoint}
                                onClick={() => checkpoint()}
                            >
                                Checkpoint
                            </GlowingButton>
                            <GlowingButton
                                theme="pink"
                                className="px-5 py-3 font-bold text-sm"
                                disabled={!canApplyRelativeWeight}
                                onClick={() => applyRelativeWeight()}
                            >
                                Apply new weight
                            </GlowingButton>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row">
                        <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-col sm:w-1/3 lg:w-1/4 shrink-0 grow-0 xl:grow mt-10 py-1 overflow-auto max-h-[28rem]">
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
                        <div className="grow xl:grow-0 xl:w-[30rem] sm:-mr-7.5 overflow-hidden">
                            <div className="h-[28rem]">
                                <AllocationChart
                                    data={farmWeightChartRecords}
                                    radius={radius}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-9">
                        <Link
                            href={{
                                query: {
                                    p: encode(),
                                },
                            }}
                            scroll={false}
                        >
                            <a>
                                <GlowingButton
                                    theme="pink"
                                    className="w-full sm:w-64 h-[3.375rem] sm:h-18 font-bold text-sm sm:text-lg"
                                >
                                    Vote now!
                                </GlowingButton>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="w-full xl:w-1/3 py-11 px-7.5 bg-stake-dark-300">
                    <h2 className="font-bold text-2xl text-white leading-tight mb-4">
                        Current DAO stats
                    </h2>
                    <div className="font-bold text-sm text-stake-gray-500 mb-12">
                        {timeLeft} lefts
                    </div>
                    <div className="grid md:grid-cols-2 xl:grid-cols-1 gap-6">
                        <div className="py-7 px-10 bg-ash-dark-400/30">
                            <div className="font-bold text-sm text-stake-gray-500 uppercase leading-tight mb-6">
                                Total veash voted
                            </div>
                            <div className="flex items-center">
                                <div className="w-4.5 h-4.5 rounded-full bg-pink-600 mr-2"></div>
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
                                <div className="w-4.5 h-4.5 rounded-full bg-pink-600 mr-2"></div>
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
                                <div className="w-4.5 h-4.5 rounded-full bg-pink-600 mr-2"></div>
                                <TextAmt
                                    number={1091291.012512}
                                    className="font-bold text-lg text-white"
                                    options={{ notation: "standard" }}
                                />
                            </div>
                        </div>
                        <div className="py-7 px-10 bg-ash-dark-400/30">
                            <div className="font-bold text-sm text-stake-gray-500 uppercase leading-tight mb-6">
                                Voting time left
                            </div>
                            <div className="flex">
                                <div className="font-bold text-lg text-white">
                                    {timeLeft}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-stake-dark-300 mt-9 p-7.5">
                <div className="flex justify-between">
                    <div className="grow">
                        <h2 className="font-bold text-2xl text-white leading-tight mb-4">
                            [Current] Farm weight relative
                        </h2>
                    </div>
                    <div className="shrink-0">
                        <div className="font-bold text-base text-stake-gray-500 text-right mb-3">
                            This DAO will ends in
                        </div>
                        <Countdown timestamp={nextTime} small />
                    </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row mt-10">
                    <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-col sm:w-1/3 lg:w-1/4 shrink-0 grow-0 mt-10 py-1 overflow-auto max-h-[28rem]">
                        {nextFarmWeightChartRecords.map((f) => {
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
                                </div>
                            );
                        })}
                    </div>
                    <div className="grow flex justify-center overflow-hidden">
                        <div className="w-[30rem] h-[28rem] sm:-mr-7.5">
                            <AllocationChart
                                data={nextFarmWeightChartRecords}
                                radius={radius}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FarmWeightOverview;
