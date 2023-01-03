import { QuestUserStatsModel } from "interface/quest";
import { atom } from "recoil";

export const atomQuestUserStats = atom<QuestUserStatsModel | undefined>({
    key: 'quest_user_stats_atom',
    default: undefined
});