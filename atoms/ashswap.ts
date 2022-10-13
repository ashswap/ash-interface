import { AshBaseState } from "graphql/type";
import { atom } from "recoil";
import { KeyedMutator } from "swr";

export const ashswapBaseState = atom<AshBaseState>({
    key: "ashswap_base_state",
    default: {
        farms: [],
        pools: [],
        tokens: [],
        votingEscrows: [],
        feeDistributor: null,
        blockchain: {},
        ashSupply: "0"
    }
});

export const ashBaseStateRefresherAtom = atom<
    KeyedMutator<any>
>({
    key: "refresh_ash_base_state",
    default: () => Promise.resolve(undefined),
});
