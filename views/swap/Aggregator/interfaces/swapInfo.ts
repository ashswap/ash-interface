export type SorSwap = {
    poolId: string;
    assetInIndex: number;
    assetOutIndex: number;
    amount: string;
    returnAmount: string;
    assetIn: string;
    assetOut: string;
    functionName: string;
    arguments: string[];
}
export type SorHop = {
    poolId: string;
    tokenInAmount: string;
    tokenOutAmount: string;
    tokenIn: string;
    tokenOut: string;
    pool: {
        allTokens: Array<{address: string, decimal: number}>;
        type: string;
    }
}
export type SorRoute = {
    hops: SorHop[];
    share: number;
    tokenIn: string;
    tokenInAmount: string;
    tokenOut: string;
    tokenOutAmount: string;
}
export type SorSwapResponse = {
    effectivePrice: number | null;
    effectivePriceReversed: number | null;
    priceImpact: number | null;
    swapAmount: string;
    returnAmount: string;
    returnAmountConsideringFees: string;
    tokenAddresses: string[];
    tokenIn: string;
    tokenOut: string;
    marketSp: string;
    routes?: SorRoute[];
    swaps: SorSwap[];
}