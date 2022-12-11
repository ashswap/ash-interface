
import { atom } from "recoil";

export const walletIsOpenConnectModalState = atom<boolean>({
    key: "wallet_is_open_connect_modal",
    default: false,
});