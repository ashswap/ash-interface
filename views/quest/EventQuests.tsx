import { atomCustomQuestData } from "atoms/ashpoint";
import { accIsLoggedInState } from "atoms/dappState";
import { ENVIRONMENT } from "const/env";
import logApi from "helper/logHelper";
import { CustomQuestMapModel, ICustomQuest } from "interface/quest";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useSWR from "swr";
import { CustomQuestItem } from "./QuestItem";

const DEFAULT_QUEST_MAP: Record<keyof CustomQuestMapModel, ICustomQuest> = {
    bop_quest: {
        quest_name: "",
        redirect: "",
    },
};

const logFetcher = (url: string) => logApi.get(url).then((res) => res.data);
function EventQuests() {
    const isLoggedIn = useRecoilValue(accIsLoggedInState);
    const {
        data: _data,
        mutate,
        isValidating,
    } = useSWR<CustomQuestMapModel>(
        isLoggedIn && ENVIRONMENT.ENABLE_ASHPOINT
            ? `/api/v1/wallet/quest`
            : null,
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
        return [...fromServer];
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
            {isValidating && !data ? (
                <div className="flex justify-center py-10">
                    <div className="w-10 h-10 rounded-full border-t-transparent border-pink-600 border-4 animate-spin"></div>
                </div>
            ) : (
                customQuests.map((q) => {
                    const key = q.__typename + q.quest_name;
                    return (
                        <CustomQuestItem
                            key={key}
                            questData={q}
                            onClaim={onClaim}
                        />
                    );
                })
            )}
        </>
    );
}

export default memo(EventQuests);
