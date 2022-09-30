import { AshBaseState } from "graphql/type";
import { atom } from "recoil";

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