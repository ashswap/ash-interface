import { tokenBalanceSelector, tokenMapState } from "atoms/tokensState";
import { ASH_TOKEN, TOKENS_MAP } from "const/tokens";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
import { Percent } from "helper/fraction/percent";
import { atom, selector } from "recoil";

export const agTokenInAtom = atom({
    key: "ag_token_in_atom",
    default: TOKENS_MAP[WRAPPED_EGLD.wegld],
});

export const agTokenOutAtom = atom({
    key: "ag_token_out_atom",
    default: TOKENS_MAP[ASH_TOKEN.identifier],
});

export const agAmountInAtom = atom({
    key: "ag_amount_in_atom",
    default: "",
});

export const agSlippageAtom = atom({
    key: "ag_slippage_atom",
    default: new Percent(100, 100_000), // 0.1%
});

export const agIsWrapSelector = selector({
    key: "ag_is_wrap_selector",
    get: ({ get }) => {
        const tokenIn = get(agTokenInAtom);
        const tokenOut = get(agTokenOutAtom);
        return tokenOut.identifier === WRAPPED_EGLD.wegld && tokenIn.identifier === "EGLD";
    },
});

export const agIsUnwrapSelector = selector({
    key: "ag_is_unwrap_selector",
    get: ({ get }) => {
        const tokenIn = get(agTokenInAtom);
        const tokenOut = get(agTokenOutAtom);
        return tokenIn.identifier === WRAPPED_EGLD.wegld && tokenOut.identifier === "EGLD";
    },
});

export const agSwapsAtom = atom({
    key: "ag_swaps_atom",
    default: [],
});

export const agIsInsufficientFundSelector = selector({
    key: "ag_is_insufficient_fund_selector",
    get: ({ get }) => {
        const balance = get(tokenBalanceSelector(get(agTokenInAtom)?.identifier));
        const amountIn = get(agAmountInAtom);
        return balance?.egld.lt(amountIn);
    },
});
