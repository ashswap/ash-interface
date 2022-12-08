import ICBambooShoot from "assets/svg/bamboo-shoot.svg";
import ICQuestPrac1 from "assets/svg/quest-practical-1.svg";
import ICQuestPrac2 from "assets/svg/quest-practical-2.svg";
import { atomQuestUserStats } from "atoms/ashpoint";
import GlowingButton from "components/GlowingButton";
import logApi from "helper/logHelper";
import { formatAmount } from "helper/number";
import { QuestAction, QuestActionType, QuestUserStatsModel } from "interface/quest";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useRecoilCallback } from "recoil";
const prac1Classes = [
    "text-ash-purple-500 colored-drop-shadow-ash-purple-500",
    "text-stake-green-500 colored-drop-shadow-stake-green-500",
    "text-ash-gray-600/10 colored-drop-shadow-transparent",
];
const colorClasses = [
    "text-ash-purple-500",
    "text-stake-green-500",
    "text-ash-gray-600",
];
const bgColorClasses = [
    "bg-ash-purple-500",
    "bg-stake-green-500",
    "bg-ash-gray-600",
];
const statusLabels = ["To do", "Claimable", "Done"];
function QuestItem({
    questData,
    type,
}: {
    questData: QuestAction;
    type: QuestActionType;
}) {
    const [claiming, setClaiming] = useState(false);
    const status = useMemo(() => {
        return questData.is_claimed
            ? 2
            : questData.progress >= questData.require
            ? 1
            : 0;
    }, [questData]);
    const name = useMemo(() => {
        switch (type) {
            case "addLiquidity":
                return `Add liquidity ${questData.require} times`;
            case "exchange":
                return `Swap ${questData.require} times`;
            case "removeLiquidity":
                return `Remove liquidity ${questData.require} times`;
            case "prize":
                return `Be active in ${questData.require} days`
            default:
                return "";
        }
    }, [questData, type]);

    const getUserStats = useRecoilCallback(({set}) => async () => {
        const stats = await logApi
            .get<QuestUserStatsModel>("/api/v1/wallet")
            .then((res) => res.data).catch(() => undefined);
        set(atomQuestUserStats, stats);
    }, []);

    const claimASHPoint = useCallback(async () => {
        const claimType = type === "prize" ? "prize" : "action";
        setClaiming(true);
        await logApi.post("/api/v1/wallet/claim", {
            claim_type: claimType,
            [claimType === "action" ? "action_name" : "prize_day"]:
                claimType === "action" ? type : questData.require,
        });
        setClaiming(false);
        await getUserStats();
    }, [questData, type, getUserStats]);



    return (
        <div className="relative px-5 lg:px-12 py-5 flex justify-between bg-ash-dark-600 border border-black">
            <div className="absolute top-2 left-1">
                <ICQuestPrac1
                    className={`w-3 lg:w-4.5 h-auto colored-drop-shadow-xs ${prac1Classes[status]}`}
                />
            </div>
            <div className="w-32 sm:w-36 shrink-0 mr-4 lg:mr-20 flex flex-col items-end">
                <div
                    className={`font-bold text-xs mb-auto ${colorClasses[status]}`}
                >
                    {statusLabels[status]}
                </div>
                <div className="font-bold mb-3">
                    <span className="text-xl sm:text-2xl text-white">
                        {questData.progress}
                    </span>
                    <span className="text-base sm:text-lg text-ash-gray-600">
                        &nbsp;/&nbsp;
                    </span>
                    <span className="text-xs text-ash-gray-600">
                        {questData.require}
                    </span>
                </div>
                <div className="relative w-full h-0.5 bg-ash-gray-600">
                    <div
                        className={`absolute inset-0 ${bgColorClasses[status]}`}
                        style={{
                            width: `${Math.min(
                                (questData.progress * 100) / questData.require,
                                100
                            )}%`,
                        }}
                    ></div>
                </div>
            </div>
            <div className="grow flex">
                <div className="grow flex flex-col justify-between">
                    <div className="mb-7 text-xs sm:text-sm leading-tight">
                        <span className="font-semibold text-ash-gray-600">
                            {"//"}
                        </span>
                        <span
                            className={`font-bold ${
                                status === 2
                                    ? "text-ash-gray-600"
                                    : "text-white"
                            }`}
                        >
                            {name}
                        </span>
                    </div>
                    <div
                        className={`relative max-w-[9rem] px-4 py-2 bg-ash-gray-600/10 ${colorClasses[status]}`}
                    >
                        <ICQuestPrac2 className="absolute top-0 left-0" />
                        <span className="font-bold text-xs">
                            {formatAmount(questData.point)} ASH points
                        </span>
                    </div>
                </div>
                <div className="shrink-0 relative ml-4 lg:ml-10 flex items-center">
                    <ICBambooShoot className="w-auto absolute -inset-y-5 -left-2 sm:-left-4 text-ash-gray-600/10" />
                    <div className="w-24 border-notch-x border-notch-white/50">
                        {status === 0 ? (
                            <Link href={questData.redirect || "/"}>
                                <a>
                                    <GlowingButton
                                        theme="purple"
                                        className="w-full h-8 clip-corner-1 clip-corner-tl font-bold text-xs"
                                    >
                                        <div className="flex items-center space-x-2.5">
                                            Go!
                                        </div>
                                    </GlowingButton>
                                </a>
                            </Link>
                        ) : status === 1 ? (
                            <GlowingButton
                                theme="green"
                                disabled={claiming}
                                className="w-full h-8 clip-corner-1 clip-corner-tl font-bold text-xs text-ash-dark-600"
                                onClick={() => claimASHPoint()}
                            >
                                <div className="flex items-center space-x-2.5">
                                    Claim
                                </div>
                            </GlowingButton>
                        ) : (
                            <GlowingButton
                                theme="green"
                                disabled={true}
                                className="w-full h-8 clip-corner-1 clip-corner-tl font-bold text-xs"
                            >
                                <div className="flex items-center space-x-2.5">
                                    Done
                                </div>
                            </GlowingButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuestItem;
