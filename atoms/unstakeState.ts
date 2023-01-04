import { atom } from "recoil";

export const clickedUnstakeModalState = atom<boolean>({
    key: "unstake_button_is_clicked",
    default: false,
});