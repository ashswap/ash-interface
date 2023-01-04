import { atom } from "recoil";

export const clickedGovStakeModalState = atom<boolean>({
    key: "gov_stake_button_is_clicked",
    default: false,
});