import { LoginMethodsEnum, useGetAccountInfo, useGetLoginInfo } from "@elrondnetwork/dapp-core";
import { atom, selector } from "recoil";

export const accLoginInfoState = atom<ReturnType<typeof useGetLoginInfo>>({
    key: "dapp_acc_login_info",
});

export const accIsLoggedInState = selector<boolean>({
    key: "dapp_acc_is_logged_in",
    get: ({get}) => !!get(accLoginInfoState)?.isLoggedIn
});

export const accAddressState = selector<string>({
    key: "dapp_acc_address",
    get: ({get}) => get(accInfoState)?.address || ""
})

export const accInfoState = atom<ReturnType<typeof useGetAccountInfo>>({
    key: "dapp_acc_info",
})

export const accIsInsufficientEGLDState = selector<boolean>({
    key: "dapp_acc_is_insufficient_egld",
    get: ({get}) => (get(accInfoState)?.account?.balance || "0") === "0"
})