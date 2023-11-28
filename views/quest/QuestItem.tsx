import ICBambooShoot from "assets/svg/bamboo-shoot.svg";
import ICQuestPrac1 from "assets/svg/quest-practical-1.svg";
import ICQuestPrac2 from "assets/svg/quest-practical-2.svg";
import { atomQuestUserStats } from "atoms/ashpoint";
import { AxiosResponse } from "axios";
import GlowingButton from "components/GlowingButton";
import { ENVIRONMENT } from "const/env";
import logApi from "helper/logHelper";
import { formatAmount } from "helper/number";
import {
    CUSTOM_QUEST_TYPES,
    CustomQuestMapModel,
    ICustomQuest,
    QuestAction,
    QuestActionType,
    QuestUserStatsModel,
    isBopQuest,
} from "interface/quest";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilCallback } from "recoil";
type Value = {
    value: number;
    label?: string;
};
type ProgressData = {
    current: Value;
    target: Value;
};
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
const actionLabelMap: { [key in QuestActionType]: string } = {
    addLiquidity: "Add liquidity",
    exchange: "Swap",
    removeLiquidity: "Remove liquidity",
    prize: "Checkin",
    enterFarm: "Enter farm",
    exitFarm: "Exit farm",
    claimRewards: "Claim farm rewards",
    claim: "Claim governance rewards",
    create_lock: "Lock ASH in governance pool",
    increase_amount: "Increase amount of ASH in governance pool",
    increase_unlock_time: "Extend lock period in governance pool",
    withdraw: "Withdraw ASH from governance pool",
    aggregate: "Use the aggregator",
};
function QuestItem({
    questData,
    type,
}: {
    questData: QuestAction;
    type: QuestActionType;
}) {
    const status = useMemo(() => {
        return questData.is_claimed
            ? 2
            : questData.progress >= questData.require
            ? 1
            : 0;
    }, [questData]);
    const name = useMemo(() => {
        const requireMsg = `${questData.require} ${
            questData.require > 1 ? "times" : "time"
        }`;
        if (type === "prize") {
            return `Complete at least 1 quest a day, repeat ${
                questData.require
            } ${questData.require > 1 ? "days" : "day"}`;
        }
        return `${actionLabelMap[type]} ${requireMsg}`;
    }, [questData, type]);

    const claim = useRecoilCallback(
        () => async (txHash: string) => {
            const claimType = type === "prize" ? "prize" : "action";
            return await logApi.post("/api/v1/wallet/claim", {
                claim_type: claimType,
                [claimType === "action" ? "action_name" : "prize_day"]:
                    claimType === "action" ? type : questData.require,
                tx_hash: txHash,
            });
        },
        [questData.require, type]
    );

    return (
        <QuestItemBase
            type={type}
            name={name}
            status={status}
            redirect={questData.redirect}
            point={questData.point}
            progressData={[
                {
                    current: { value: questData.progress },
                    target: { value: questData.require },
                },
            ]}
            onClaim={claim}
        />
    );
}

export function CustomQuestItem({
    questData,
    onClaim,
}: {
    questData: ICustomQuest;
    onClaim?: () => Promise<void>;
}) {
    const [name, setName] = useState("");
    const [note, setNote] = useState<React.ReactNode>("");
    const [status, setStatus] = useState(0);
    const [point, setPoint] = useState(0);
    const [require, setRequire] = useState(0);
    const [progresses, setProgresses] = useState<ProgressData[]>([]);

    const claim = useRecoilCallback(
        () => async (txHash: string) => {
            const res = await logApi.post("/api/v1/wallet/claim", {
                claim_type: questData.__typename,
                action_name: questData.quest_name,
                tx_hash: txHash,
            });
            onClaim?.();
            return res;
        },
        [questData, onClaim]
    );

    useEffect(() => {
        if (isBopQuest(questData)) {
            setName("Battle of Perps Buy-in");
            setStatus(questData.tx_hash ? 0 : 0);
            setPoint(questData.point);
            const isAbsolute = ["http://", "https://"].some((p) =>
                questData.redirect.startsWith(p)
            );
            setNote(
                <span>
                    Visit{" "}
                    <Link
                        href={questData.redirect}
                        target={isAbsolute ? "_blank" : "_self"}
                    >
                        <span className="text-stake-gray-500 underline decoration-dashed">
                            Battle of Perps
                        </span>
                    </Link>{" "}
                    to complete the quest
                </span>
            );
            // setRequire(questData.require);
            // setProgresses([{current: }])
        }
    }, [questData]);

    return (
        <QuestItemBase
            type={questData.__typename as keyof CustomQuestMapModel}
            name={name}
            status={status}
            redirect={questData.redirect}
            point={point}
            progressData={progresses}
            onClaim={claim}
            note={note}
        />
    );
}

type QuestProgressProps = {
    progressData: ProgressData;
    type: QuestActionType | keyof CustomQuestMapModel;
    status: number;
};

function QuestProgress({ progressData, type, status }: QuestProgressProps) {
    const {
        current: { value: progress, label: progressLabel },
        target: { value: require, label: requireLabel },
    } = progressData;
    const isCustomQuest = useMemo(() => {
        return CUSTOM_QUEST_TYPES.includes(type as keyof CustomQuestMapModel);
    }, [type]);
    return (
        <div className="w-full flex flex-col items-end">
            <div className="font-bold mb-2">
                <span className="text-sm sm:text-xl text-white">
                    {progressLabel ||
                        formatAmount(progress, {
                            isInteger: !isCustomQuest,
                        })}
                </span>
                <span className="text-base sm:text-lg text-ash-gray-600">
                    &nbsp;/&nbsp;
                </span>
                <span className="text-2xs sm:text-xs text-ash-gray-600">
                    {requireLabel ||
                        formatAmount(require, {
                            isInteger: !isCustomQuest,
                            isIntegerAuto: isCustomQuest,
                        })}
                </span>
            </div>
            <div className="relative w-full h-0.5 bg-ash-gray-600">
                <div
                    className={`absolute inset-0 ${bgColorClasses[status]}`}
                    style={{
                        width: `${Math.min((progress * 100) / require, 100)}%`,
                    }}
                ></div>
            </div>
        </div>
    );
}

type QuestItemBaseProps = {
    status: number;
    point: number;
    redirect: string;
    name: string;
    type: QuestActionType | keyof CustomQuestMapModel;
    progressData: ProgressData[];
    note?: React.ReactNode;
    onClaim: (txHash: string) => Promise<AxiosResponse>;
};
function QuestItemBase({
    status,
    point,
    redirect,
    name,
    type,
    progressData,
    note,
    onClaim,
}: QuestItemBaseProps) {
    const [claiming, setClaiming] = useState(false);
    const [txHash, setTxHash] = useState("");
    const [error, setError] = useState("");

    const getUserStats = useRecoilCallback(
        ({ set }) =>
            async () => {
                if (ENVIRONMENT.ENABLE_ASHPOINT) {
                    const stats = await logApi
                        .get<QuestUserStatsModel>("/api/v1/wallet")
                        .then((res) => res.data)
                        .catch(() => undefined);
                    set(atomQuestUserStats, stats);
                }
            },
        []
    );

    const computedHash = useMemo(() => {
        const hash = txHash.trim();
        const match = hash.match(/^.*\/transactions\/.{64}/);
        const result = !match?.length
            ? hash
            : match[0].substring(match[0].length - 64);
        return result.length === 64 ? result : "";
    }, [txHash]);

    const claimASHPoint = useCallback(async () => {
        setClaiming(true);
        try {
            await onClaim(computedHash);
            setError("");
        } catch (error: any) {
            setError(error?.response?.data?.error || "Something went wrong");
        } finally {
            setClaiming(false);
        }
        await getUserStats();
    }, [getUserStats, onClaim, computedHash]);

    return (
        <div className="relative px-4 sm:px-5 lg:px-12 py-5 flex flex-col xs:flex-row justify-between bg-ash-dark-600 border border-black">
            <div className="absolute top-2 left-1">
                <ICQuestPrac1
                    className={`w-3 lg:w-4.5 h-auto colored-drop-shadow-xs ${prac1Classes[status]}`}
                />
            </div>
            <div className="w-full xs:w-1/3 sm:w-36 shrink-0 mb-4 xs:mb-0 xs:mr-4 xl:mr-20 flex flex-col items-end">
                <div
                    className={`font-bold text-xs mb-auto ${colorClasses[status]}`}
                >
                    {statusLabels[status]}
                </div>
                <div className="w-full space-y-2">
                    {progressData.map((data, i) => (
                        <QuestProgress
                            key={i}
                            progressData={data}
                            type={type}
                            status={status}
                        />
                    ))}
                </div>
            </div>
            <div className="grow flex">
                <div className="grow flex flex-col justify-between">
                    <div className="mb-7">
                        <div className="text-2xs sm:text-sm leading-tight">
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
                        {note && (
                            <div className="font-bold text-2xs sm:text-xs text-stake-gray-500">
                                {note}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div
                            className={`relative max-w-[9rem] px-2 py-1 sm:px-4 sm:py-2 bg-ash-gray-600/10 ${colorClasses[status]}`}
                        >
                            <ICQuestPrac2 className="absolute top-0 left-0" />
                            <span className="font-bold text-2xs sm:text-xs truncate">
                                {formatAmount(point, { isInteger: true })} ASH
                                points
                            </span>
                        </div>
                        <div className="relative flex items-center gap-4">
                            {status === 0 && type !== "prize" && (
                                <div className="grow sm:max-w-[16rem]">
                                    <input
                                        className="py-2.5 px-4 min-w-0 w-full shrink grow bg-ash-dark-500 outline-none text-2xs sm:text-xs"
                                        value={txHash}
                                        onChange={(e) =>
                                            setTxHash(e.target.value)
                                        }
                                        placeholder="Please input your Tx here"
                                    />
                                </div>
                            )}

                            <div className="shrink w-20 sm:w-24 border-notch-x border-notch-white/50">
                                {status !== 2 ? (
                                    <GlowingButton
                                        theme="green"
                                        disabled={
                                            claiming ||
                                            (type === "prize" &&
                                                status === 0) ||
                                            (type !== "prize" && !computedHash)
                                        }
                                        className="w-full h-8 clip-corner-1 clip-corner-tl font-bold text-xs text-ash-dark-600"
                                        onClick={() => claimASHPoint()}
                                    >
                                        <div className="flex items-center space-x-2.5">
                                            Submit
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
                            {error && (
                                <span className="absolute -bottom-4 inline-block max-w-full truncate text-2xs text-ash-purple-500">
                                    {error}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="shrink-0 relative flex items-center">
                    <div className="absolute -inset-y-5 -left-2 sm:-left-4 overflow-hidden">
                        <ICBambooShoot className="w-14 h-auto text-ash-gray-600/10" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuestItem;
