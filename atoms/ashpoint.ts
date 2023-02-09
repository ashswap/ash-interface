import { CustomQuestMapModel, QuestUserStatsModel } from "interface/quest";
import { atom, selector } from "recoil";
import { accAddressState } from "./dappState";

export const atomQuestUserStats = atom<QuestUserStatsModel | undefined>({
    key: 'quest_user_stats_atom',
    default: undefined
});

export const atomCustomQuestData = atom<CustomQuestMapModel | undefined>({
    key: "custom_quest_data",
    default: undefined
})

export const questIsRegisteredSelector = selector({
    key: "quest_is_registered",
    get: ({ get }) => {
        const userStats = get(atomQuestUserStats);
        const userAddress = get(accAddressState);
        return (
            (userStats?.wallet?.twitter_username ||
                userStats?.wallet?.discord_id) &&
            userStats.wallet.wallet_address === userAddress
        );
    }
})