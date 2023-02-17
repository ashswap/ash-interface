import BigNumber from "bignumber.js";
import { TokenAmount } from "helper/token/tokenAmount";

export const getPrecisions = (reserves: TokenAmount[]) => {
    const nCoins = reserves.length;
    switch (nCoins) {
        case 2:
            return reserves.map((r) => 10 ** (18 - r.token.decimals));
        case 3:
            return [1, 1, 1];
        case 4:
            return reserves.map(() => 10 ** 8);
        default:
            return reserves.map(() => 1);
    }
};

export const getCurveV2Config = (reserves: TokenAmount[]) => {
    const PRECISION = new BigNumber(10 ** 18);
    const A_MULTIPLIER = new BigNumber(10_000);
    const PRECISIONS = getPrecisions(reserves);
    const N_COINS = reserves.length;
    const MIN_A = new BigNumber(N_COINS)
        .pow(N_COINS)
        .multipliedBy(A_MULTIPLIER)
        .idiv(10);
    const MAX_A = new BigNumber(N_COINS)
        .pow(N_COINS)
        .multipliedBy(A_MULTIPLIER)
        .multipliedBy(10_000);
    return {
        PRECISION,
        A_MULTIPLIER,
        PRECISIONS,
        N_COINS,
        MIN_A,
        MAX_A,
        MIN_GAMMA: new BigNumber(10**10),
        MAX_GAMMA: new BigNumber(2).multipliedBy(10**16),
    };
};
