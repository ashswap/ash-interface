import { CustomQuestMapModel, QuestUserStatsModel } from "interface/quest";
import { atom } from "recoil";

export const atomQuestUserStats = atom<QuestUserStatsModel | undefined>({
    key: 'quest_user_stats_atom',
    default: undefined
});

export const atomCustomQuestData = atom<CustomQuestMapModel | undefined>({
    key: "custom_quest_data",
    default: undefined
})