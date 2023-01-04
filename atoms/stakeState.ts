import { atom } from "recoil";

export const clickedStakeModalState = atom<boolean>({
    key: "Stake_button_is_clicked",
    default: false,
});