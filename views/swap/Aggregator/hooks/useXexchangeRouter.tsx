import BigNumber from "bignumber.js";
import { ENVIRONMENT } from "const/env";
import request, { Variables, gql } from "graphql-request";
import { getTokenIdFromCoin } from "helper/token";
import { useMemo } from "react";
import useSWR, { SWRConfiguration } from "swr";
export const graphqlFetcher = (query: string, variables?: Variables) =>
    request(`${ENVIRONMENT.XEXCHANGE_GRAPH_API}/graphql`, query, variables);
const useXexchangeRouter = (
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    tolerance = 0.01,
    swrConfig: SWRConfiguration = {}
) => {
    const params = useMemo(() => {
        const inId = getTokenIdFromCoin(tokenIn);
        const outId = getTokenIdFromCoin(tokenOut);
        if (!inId || !outId || !amountIn || !new BigNumber(amountIn).gt(0) || !ENVIRONMENT.XEXCHANGE_GRAPH_API)
            return null;
        return [
            gql`
                query($amountIn: String!, $tokenIn: String!, $tokenOut: String!, $tolerance: Float!) {
                    swap(amountIn: $amountIn, tokenInID: $tokenIn, tokenOutID: $tokenOut, tolerance: $tolerance){
                        amountOut
                    }
                }
            `,
            { amountIn, tokenIn: inId, tokenOut: outId, tolerance },
        ];
    }, [amountIn, tokenIn, tokenOut, tolerance]);
    const res = useSWR<{ swap: { amountOut: string } }>(
        params,
        graphqlFetcher,
        swrConfig
    );
    return res;
};

export default useXexchangeRouter;
