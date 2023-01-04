import { atom } from "recoil";

export const notFirstRenderConnectWallet = atom<boolean>({
    key: "first_render_connect_wallet",
    default: false,
});