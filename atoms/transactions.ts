import { atom } from "recoil";

export const completedTxsAtom = atom<string[]>({
    key: 'completed_txs_socket',
    default: []
})