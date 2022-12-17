import { atom } from "recoil";

export const collapseModalState = atom<boolean>({
    key: "message_is_collapsed",
    default: false,
});