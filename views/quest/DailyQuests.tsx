import { atomQuestUserStats } from "atoms/ashpoint";
import { QuestActionType } from "interface/quest";
import React, { memo, useMemo } from "react";
import { useRecoilValue } from "recoil";
import QuestItem from "./QuestItem";

function DailyQuests() {
    const userStats = useRecoilValue(atomQuestUserStats);
    const quests = useMemo(() => {
        return Object.entries(userStats?.action || {}).sort(
            ([k1, q1], [k2, q2]) => (q2.is_claimed ? -1 : 1)
        );
    }, [userStats]);
    return (
        <>
            {quests.map(([k, q]) => (
                <QuestItem key={k} questData={q} type={k as QuestActionType} />
            ))}
        </>
    );
}

export default memo(DailyQuests);
