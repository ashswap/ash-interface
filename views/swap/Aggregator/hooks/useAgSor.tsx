import BigNumber from "bignumber.js";
import { blockTimeMs } from "const/dappConfig";
import { ENVIRONMENT } from "const/env";
import { fetcher } from "helper/common";
import { getTokenIdFromCoin } from "helper/token";
import { useMemo } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { SorSwapResponse } from "../interfaces/swapInfo";

const useAgSor = (
    tokenIn: string,
    tokenOut: string,
    amtIn: string,
    swrConfig: SWRConfiguration = {}
) => {
    const params = useMemo(() => {
        const params = {
            from: getTokenIdFromCoin(tokenIn),
            to: getTokenIdFromCoin(tokenOut),
            amount: amtIn,
        };
        if (
            params.from &&
            params.to &&
            new BigNumber(amtIn).gt(0) &&
            params.from !== params.to
        ) {
            return [`${ENVIRONMENT.AG_API}/aggregate`, params];
        }
        return null;
    }, [amtIn, tokenIn, tokenOut]);
    const res = useSWR<SorSwapResponse>(
        params,
        async ([url, params]) => {
            const searchParams = new URLSearchParams(params);
            return fetcher([`${url}?${searchParams}`, {
                headers: { "authen-token": ENVIRONMENT.AG_TOKEN_SECRET },
            }]);
        },
        { refreshInterval: blockTimeMs, ...swrConfig }
    );
    return res;
};

export default useAgSor;
