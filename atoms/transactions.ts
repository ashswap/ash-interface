import { atom } from "recoil";

export const lastCompletedTxHashAtom = atom<string>({
    key: "last_completed_tx_hash",
    default: "",
});
