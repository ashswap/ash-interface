import { createContext, useContext, useState, useMemo } from "react";
import BigNumber from "bignumber.js";
import pools from "const/pool";
import { IToken, ITokenMap } from "interface/token";
import IPool from "interface/pool";
import { emptyFunc } from "helper/common";

export interface State {
    tokenFrom?: IToken;
    tokenTo?: IToken;
    valueFrom?: string;
    valueTo?: string;
    pool?: IPool;
    rates?: BigNumber[];
    isInsufficentFund: boolean;
    setInsufficentFund: (v: boolean) => void;
    setValueFrom: (v: string) => void;
    setValueTo: (v: string) => void;
    setTokenFrom: (t: IToken | undefined) => void;
    setTokenTo: (t: IToken | undefined) => void;
    setRates: (r: BigNumber[] | undefined) => void;
}

export const initState: State = {
    isInsufficentFund: false,
    setInsufficentFund: emptyFunc,
    setValueFrom: emptyFunc,
    setValueTo: emptyFunc,
    setTokenFrom: emptyFunc,
    setTokenTo: emptyFunc,
    setRates: emptyFunc,
};

export const SwapContext = createContext<State>(initState);
export function useSwap() {
    return useContext(SwapContext);
}

interface Props {
    children: any;
}

export function SwapProvider({ children }: Props) {
    const [tokenFrom, setTokenFrom] = useState<IToken | undefined>(undefined);
    const [valueFrom, setValueFrom] = useState<string>("");
    
    const [tokenTo, setTokenTo] = useState<IToken | undefined>(undefined);
    const [valueTo, setValueTo] = useState<string>("");
    
    const [rates, setRates] = useState<BigNumber[] | undefined>(undefined);
    const [isInsufficentFund, setInsufficentFund] = useState<boolean>(false);

    const pool = useMemo(() => {
        if (!tokenFrom || !tokenTo) {
            return;
        }

        const pool = pools.find(p => {
            return (
                p.tokens.findIndex(t => t.id === tokenFrom?.id) !== -1 &&
                p.tokens.findIndex(t => t.id === tokenTo?.id) !== -1
            );
        });

        return pool
    }, [tokenFrom, tokenTo]);

    const value: State = {
        ...initState,
        tokenFrom,
        tokenTo,
        valueFrom,
        valueTo,
        pool,
        rates,
        isInsufficentFund,
        setValueFrom,
        setValueTo,
        setTokenFrom,
        setTokenTo,
        setRates,
        setInsufficentFund,
    };

    return (
        <SwapContext.Provider value={value}>{children}</SwapContext.Provider>
    );
}
