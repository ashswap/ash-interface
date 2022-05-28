import { TokenOfAccountOnNetwork } from "@elrondnetwork/erdjs/out";
import { ITokenMap } from "interface/token";
import { atom } from "recoil";

export const walletLPMapState = atom<ITokenMap>({
    key: "wallet_lp_map",
    default: {},
});

export const walletBalanceState = atom<
    Record<string, TokenOfAccountOnNetwork | null>
>({
    key: "wallet_balances",
    default: {},
});

export const walletTokenPriceState = atom<any>({
    key: "wallet_token_ptices",
    default: {},
});

export const walletIsOpenConnectModalState = atom<boolean>({
    key: "wallet_is_open_connect_modal",
    default: false,
});