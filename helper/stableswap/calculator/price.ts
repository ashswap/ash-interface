import BigNumber from "bignumber.js";
import { Fraction } from "helper/fraction/fraction";
import { Price } from "helper/token/price";
import { IESDTInfo } from "helper/token/token";
import { TokenAmount } from "helper/token/tokenAmount";
import { calculateEstimatedSwapOutputAmount2 } from "./amounts";

/**
 * Gets the price of the second token in the swap, i.e. "Token 1", with respect to "Token 0".
 *
 * To get the price of "Token 0", use `.invert()` on the result of this function.
 * @returns
 */
export const calculateSwapPrice = (
    amp: BigNumber,
    reserves: TokenAmount[],
    fromToken: IESDTInfo,
    toToken: IESDTInfo,
    fees: { swap: Fraction; admin: Fraction }
): Price => {
    const fromReserves = reserves.find(
        (r) => r.token.identifier === fromToken.identifier
    );
    const toReserves = reserves.find(
        (r) => r.token.identifier === toToken.identifier
    );
    if (!fromReserves || !toReserves) {
        throw new Error(
            `from token ${fromToken.identifier} or to token ${
                toToken.identifier
            } is not in reserves(${reserves.map((r) => r.token.identifier)})`
        );
    }

    // We try to get at least 4 decimal points of precision here
    // Otherwise, we attempt to swap 1% of total supply of the pool
    // or at most, $1
    const inputAmountNum = BigNumber.max(
        10_000,
        BigNumber.min(
            new BigNumber(10).exponentiatedBy(fromToken.decimals),
            new BigNumber(fromReserves.divide(100).toFixed(0))
        )
    );

    const inputAmount = new TokenAmount(fromToken, inputAmountNum);
    const outputAmount = calculateEstimatedSwapOutputAmount2(
        amp,
        reserves,
        inputAmount,
        toReserves.token,
        fees
    ).outputAmount;
    return new Price(inputAmount, outputAmount);
};
