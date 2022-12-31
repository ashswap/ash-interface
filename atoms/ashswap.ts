import { AshBaseState, GraphOptions } from "graphql/type";
import { atom, selector } from "recoil";
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
        ashSupply: "0",
    },
});


export const ashBaseStateRefresherAtom = atom<KeyedMutator<any>>({
    key: "refresh_ash_base_state",
    default: () => Promise.resolve(undefined),
});

export const gqlQueryOptionsAtom = atom<Record<keyof GraphOptions, number>>({
    key: "graphql_query_options_atom",
    default: {
        withBlockchain: 0,
        withFarms: 0,
        withFB: 0,
        withFC: 0,
        withFD: 0,
        withPools: 0,
        withSupply: 0,
        withTokens: 0,
        withVE: 0,
    }
})

export const gqlQueryOptionsSelector = selector<GraphOptions>({
    key: "graphql_query_options_selector",
    get: ({get}) => {
        const subNum = get(gqlQueryOptionsAtom);
        const entries = Object.entries(subNum).map(([k, v]) => {
            return [k, v > 0]
        });
        return Object.fromEntries(entries);
    }
})
