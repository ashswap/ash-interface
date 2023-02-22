import { atomCustomQuestData } from "atoms/ashpoint";
import { accIsLoggedInState } from "atoms/dappState";
import { ENVIRONMENT } from "const/env";
import logApi from "helper/logHelper";
import {
    CustomQuestMapModel,
    FarmQuest,
    GovQuest,
    ICustomQuest,
    ManualQuest,
    SwapQuest,
} from "interface/quest";
import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useSWR from "swr";
import { CustomQuestItem } from "./QuestItem";

const DEFAULT_CUSTOM_QUEST: ICustomQuest = {
    end: 0,
    last_claimed: 0,
    quest_name: "",
    redirect: "",
    require: 0,
    start: 0,
};
const DEFAULT_FARM_QUEST: FarmQuest = {
    ...DEFAULT_CUSTOM_QUEST,
    continuous_day: 0,
    continuous_run: 0,
    min_time: 0,
    point: 0,
    stake_amount: 0,
};

const DEFAULT_GOV_QUEST: GovQuest = {
    ...DEFAULT_CUSTOM_QUEST,
    create_lock_at: 0,
    locked_end_at: 0,
    min_time: 0,
    prize: [],
    ve_ash_amount: 0,
};

const DEFAULT_SWAP_QUEST: SwapQuest = {
    ...DEFAULT_CUSTOM_QUEST,
    point: 0,
    swap_amount: 0,
};

const DEFAULT_QUEST_MAP: Record<keyof CustomQuestMapModel, ICustomQuest> = {
    farm_quest: DEFAULT_FARM_QUEST,
    governance_quest: DEFAULT_GOV_QUEST,
    swap_quest: DEFAULT_SWAP_QUEST,
};

const MANUAL_QUESTS: ManualQuest[] = [
    {
        title: "Spread The Heat",
        note: "*Reward will be manually added after having the result.",
        redirect:
            "https://gleam.io/bxumG/spread-the-heat-ash-point-custom-quest",
        __typename: "manual_quest",
        point: 10000,
        start: 1676736000,
        end: 1677945600,
        require: 1,
        last_claimed: 0,
        quest_name: "spread-the-heat",
    },
];

const logFetcher = (url: string) => logApi.get(url).then((res) => res.data);
function EventQuests() {
    const isLoggedIn = useRecoilValue(accIsLoggedInState);
    const {
        data: _data,
        mutate,
        isValidating,
    } = useSWR<CustomQuestMapModel>(
        isLoggedIn && ENVIRONMENT.ENABLE_ASHPOINT ? `/api/v1/wallet/quest` : null,
        logFetcher
    );
    const [cachedData, setCachedData] = useRecoilState(atomCustomQuestData);
    const mutateRef = useRef(mutate);
    const data = useMemo(() => {
        return _data || cachedData;
    }, [_data, cachedData]);
    const customQuests = useMemo(() => {
        const entries = Object.entries(data || {});
        const fromServer = entries.reduce((total: ICustomQuest[], [k, v]) => {
            const questEntries: [string, ICustomQuest][] = Object.entries(v);
            return [
                ...total,
                ...questEntries.map(([quest_name, q]) => ({
                    ...DEFAULT_QUEST_MAP[k as keyof CustomQuestMapModel],
                    ...q,
                    quest_name,
                    __typename: k,
                })),
            ];
        }, []);
        return [...fromServer, ...MANUAL_QUESTS];
    }, [data]);
    const onClaim = useCallback(async () => {
        await mutateRef.current?.();
    }, []);
    useEffect(() => {
        mutateRef.current = mutate;
    }, [mutate]);
    useEffect(() => {
        if (_data) {
            setCachedData(_data);
        }
    }, [_data, setCachedData]);

    return (
        <>
            {isValidating && !data && (
                <div className="flex justify-center py-10">
                    <div className="w-10 h-10 rounded-full border-t-transparent border-pink-600 border-4 animate-spin"></div>
                </div>
            )}
            {customQuests.map((q) => {
                const key = q.__typename + q.quest_name;
                return (
                    <CustomQuestItem
                        key={key}
                        questData={q}
                        onClaim={onClaim}
                    />
                );
            })}
        </>
    );
}

export default memo(EventQuests);
