import storage from "helper/storage";
import { CustomQuestMapModel, QuestUserStatsModel } from "interface/quest";
import { atom, selector } from "recoil";
import { accAddressState } from "./dappState";

export const atomQuestUserStats = atom<QuestUserStatsModel | undefined>({
    key: "quest_user_stats_atom",
    default: undefined,
});

export const atomCustomQuestData = atom<CustomQuestMapModel | undefined>({
    key: "custom_quest_data",
    default: undefined,
});

export const questIsRegisteredAtom = atom<boolean>({
    key: "quest_is_registered",
    default: false,
});
const questSignatureAtom = atom<{ signature?: string; rejected?: boolean }>({
    key: "quest_signature_atom",
    default: undefined,
});
export const questOwnerSignatureSelector = selector<{
    signature?: string;
    rejected?: boolean;
}>({
    key: "quest_owner_signature_selector",
    get: ({ get }) => {
        const address = get(accAddressState);
        const state = address
            ? get(questSignatureAtom) ||
              storage.local.getItem("ashpointOwners")?.[address] ||
              {}
            : {};
        return state;
    },
    set: ({ set, get }, val) => {
        const address = get(accAddressState);
        const map = storage.local.getItem("ashpointOwners") || {};
        storage.local.setItem({
            key: "ashpointOwners",
            data: { ...map, [address]: val },
        });
        set(questSignatureAtom, val);
    },
});

export const questIsOpenOwnerSignModalAtom = atom({
    key: "quest_is_open_owner_sign_modal_atom",
    default: false,
})