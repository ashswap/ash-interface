import pools from "const/pool";
import { TOKENS_MAP } from "const/tokens";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
import { emptyFunc } from "helper/common";
import { Percent } from "helper/fraction/percent";
import { getTokenIdFromCoin } from "helper/token";
import { IESDTInfo } from "helper/token/token";
import IPool from "interface/pool";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export interface State {
    tokenFrom?: IESDTInfo;
    tokenTo?: IESDTInfo;
    valueFrom?: string;
    valueTo?: string;
    pool?: IPool;
    isInsufficentFund: boolean;
    slippage: Percent;
    isWrap: boolean;
    isUnwrap: boolean;
    setSlippage: (slippage: Percent) => void;
    setInsufficentFund: (v: boolean) => void;
    setValueFrom: (v: string) => void;
    setValueTo: (v: string) => void;
    setTokenFrom: (t: IESDTInfo | undefined) => void;
    setTokenTo: (t: IESDTInfo | undefined) => void;
}

export const initState: State = {
    slippage: new Percent(100, 100_000), //0.1%
    isInsufficentFund: false,
    isWrap: false,
    isUnwrap: false,
    setSlippage: emptyFunc,
    setInsufficentFund: emptyFunc,
    setValueFrom: emptyFunc,
    setValueTo: emptyFunc,
    setTokenFrom: emptyFunc,
    setTokenTo: emptyFunc,
};

export const SwapContext = createContext<State>(initState);
export function useSwap() {
    return useContext(SwapContext);
}

interface Props {
    children: any;
}

export function SwapProvider({ children }: Props) {
    const [tokenFrom, setTokenFrom] = useState<IESDTInfo | undefined>(
        undefined
    );
    const [valueFrom, setValueFrom] = useState<string>("");
    const [slippage, setSlippage] = useState<Percent>(initState.slippage);
    const [tokenTo, setTokenTo] = useState<IESDTInfo | undefined>(undefined);
    const [_valueTo, setValueTo] = useState<string>("");

    const [isInsufficentFund, setInsufficentFund] = useState<boolean>(false);

    const router = useRouter();

    const pool = useMemo(() => {
        if (!tokenFrom || !tokenTo) {
            return;
        }
        if(getTokenIdFromCoin(tokenFrom?.identifier) === getTokenIdFromCoin(tokenTo?.identifier)) return;
        const pool = pools.find((p) => {
            return (
                p.tokens.findIndex(
                    (t) =>
                        t.identifier ===
                        getTokenIdFromCoin(tokenFrom?.identifier)
                ) !== -1 &&
                p.tokens.findIndex(
                    (t) =>
                        t.identifier === getTokenIdFromCoin(tokenTo?.identifier)
                ) !== -1
            );
        });
        return pool;
    }, [tokenFrom, tokenTo]);

    const isWrap = useMemo(() => {
        return tokenFrom?.identifier === "EGLD" && tokenTo?.identifier === WRAPPED_EGLD.wegld;
    }, [tokenFrom, tokenTo]);

    const isUnwrap = useMemo(() => {
        return tokenTo?.identifier === "EGLD" && tokenFrom?.identifier === WRAPPED_EGLD.wegld;
    }, [tokenFrom, tokenTo]);

    useEffect(() => {
        setValueFrom("");
        setValueTo("");
    }, [pool]);

    useEffect(() => {
        if (!valueFrom) {
            setValueTo("");
        }
    }, [valueFrom]);
    
    useEffect(() => setTokenFrom(TOKENS_MAP[router.query.tokenIn as string]), [router.query.tokenIn]);
    useEffect(() => setTokenTo(TOKENS_MAP[router.query.tokenOut as string]), [router.query.tokenOut]);
    const valueTo = useMemo(() => {
        return isWrap || isUnwrap ? valueFrom : _valueTo;
    }, [_valueTo, isUnwrap, isWrap, valueFrom]);

    const value: State = {
        ...initState,
        tokenFrom,
        tokenTo,
        valueFrom,
        valueTo,
        pool,
        isInsufficentFund,
        slippage,
        isWrap,
        isUnwrap,
        setSlippage,
        setValueFrom,
        setValueTo,
        setTokenFrom,
        setTokenTo,
        setInsufficentFund,
    };

    return (
        <SwapContext.Provider value={value}>{children}</SwapContext.Provider>
    );
}
