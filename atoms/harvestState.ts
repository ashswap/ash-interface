import { atom } from "recoil";

export const clickedHarvestModalState = atom<boolean>({
    key: "harvest_button_is_clicked",
    default: false,
});