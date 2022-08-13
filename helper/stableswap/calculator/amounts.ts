import BigNumber from "bignumber.js";
import { Fraction } from "helper/fraction/fraction";
import { TokenAmount } from "helper/token/tokenAmount";
import { computeD, computeY } from "./curve";

/**
 * Calculates the current virtual price of the exchange.
 */
export const calculateVirtualPrice = (
    ampFactor: BigNumber,
    reserves: BigNumber[],
    lpTotalSupply: BigNumber
): Fraction | null => {
    const amount = lpTotalSupply;
    if (amount === undefined || amount.eq(0)) {
        // pool has no tokens
        return null;
    }
    const price = new Fraction(computeD(ampFactor, reserves), amount);
    return price;
};

/**
 * Calculates the estimated output amount of a swap.
 */
export const calculateEstimatedSwapOutputAmount = (
    amp: BigNumber,
    toReserves: TokenAmount,
    reserves: TokenAmount[],
    fromAmount: TokenAmount,
    fees: {
        swap: Fraction;
        admin: Fraction;
    }
): {
    [K in
        | "outputAmountBeforeFees"
        | "outputAmount"
        | "fee"
        | "lpFee"
        | "adminFee"]: TokenAmount;
} => {
    const fromReserves = reserves.find(
        (r) => r.token.identifier === fromAmount.token.identifier
    );
    if (fromAmount.equalTo(0) || !fromReserves) {
        const zero = new TokenAmount(toReserves.token, 0);
        return {
            outputAmountBeforeFees: zero,
            outputAmount: zero,
            fee: zero,
            lpFee: zero,
            adminFee: zero,
        };
    }

    const amountBeforeFees = toReserves.raw.minus(
        computeY(
            amp,
            fromReserves.raw.plus(fromAmount.raw),
            computeD(
                amp,
                reserves.map((r) => r.raw)
            )
        )
    );

    const outputAmountBeforeFees = new TokenAmount(
        toReserves.token,
        amountBeforeFees
    );

    const fee = new TokenAmount(
        toReserves.token,
        fees.swap.multiply(amountBeforeFees).toFixed(0)
    );

    const adminFee = new TokenAmount(
        toReserves.token,
        fees.admin.multiply(fee.raw).toFixed(0)
    );
    const lpFee = fee.subtract(adminFee);

    const outputAmount = new TokenAmount(
        toReserves.token,
        amountBeforeFees.minus(fee.raw)
    );

    return {
        outputAmountBeforeFees,
        outputAmount,
        fee: fee,
        lpFee,
        adminFee,
    };
};

const N_COINS = new BigNumber(2);

export interface IWithdrawOneResult {
    withdrawAmount: TokenAmount;
    withdrawAmountBeforeFees: TokenAmount;
    swapFee: TokenAmount;
    withdrawFee: TokenAmount;
    lpSwapFee: TokenAmount;
    lpWithdrawFee: TokenAmount;
    adminSwapFee: TokenAmount;
    adminWithdrawFee: TokenAmount;
}

export const calculateEstimatedWithdrawAmount = ({
    poolTokenAmount,
    reserves,
    lpTotalSupply,
    withdrawFee = new Fraction(0),
}: {
    /**
     * Amount of pool tokens to withdraw
     */
    poolTokenAmount: TokenAmount;
    reserves: TokenAmount[];
    lpTotalSupply: TokenAmount;
    withdrawFee?: Fraction;
}): {
    withdrawAmounts: readonly TokenAmount[];
    withdrawAmountsBeforeFees: readonly TokenAmount[];
    fees: readonly TokenAmount[];
} => {
    if (lpTotalSupply.equalTo(0)) {
        const zero = reserves.map((r) => new TokenAmount(r.token, 0));
        return {
            withdrawAmounts: zero,
            withdrawAmountsBeforeFees: zero,
            fees: zero,
        };
    }

    const share = poolTokenAmount.divide(lpTotalSupply);

    const withdrawAmounts = reserves.map((r) => {
        const baseAmount = share.multiply(r.raw);
        const fee = baseAmount.multiply(withdrawFee);
        return {
            amount: new TokenAmount(
                r.token,
                new BigNumber(baseAmount.subtract(fee).toFixed(0))
            ),
            beforeFees: new TokenAmount(
                r.token,
                new BigNumber(baseAmount.toFixed(0))
            ),
            fee: new TokenAmount(r.token, new BigNumber(fee.toFixed(0))),
        };
    });

    return {
        withdrawAmountsBeforeFees: withdrawAmounts.map(
            ({ beforeFees }) => beforeFees
        ),
        withdrawAmounts: withdrawAmounts.map(({ amount }) => amount),
        fees: withdrawAmounts.map(({ fee }) => fee),
    };
};

/**
 * Compute normalized fee for symmetric/asymmetric deposits/withdraws
 */
export const normalizedTradeFee = (
    swapFee: Fraction,
    n_coins: BigNumber,
    amount: BigNumber
): Fraction => {
    const adjustedTradeFee = new Fraction(
        n_coins,
        n_coins.minus(1).multipliedBy(4)
    );
    return new Fraction(amount, 1).multiply(swapFee).multiply(adjustedTradeFee);
};

/**
 * Calculate the estimated amount of LP tokens minted after a deposit.
 * @param exchange
 * @param depositAmountA
 * @param depositAmountB
 * @returns
 */
export const calculateEstimatedMintAmount = (
    amp: BigNumber,
    reserves: TokenAmount[],
    swapFee: Fraction,
    lpTotalSupply: TokenAmount,
    depositAmounts: BigNumber[]
): {
    mintAmountBeforeFees: TokenAmount;
    mintAmount: TokenAmount;
    fees: TokenAmount;
} => {
    if (depositAmounts.every((amt) => amt.eq(0))) {
        const zero = new TokenAmount(lpTotalSupply.token, 0);
        return {
            mintAmountBeforeFees: zero,
            mintAmount: zero,
            fees: zero,
        };
    }
    const oldBalances = reserves.map((r) => r.raw);
    const newBalances = reserves.map((r, i) =>
        r.raw.plus(depositAmounts[i] || 0)
    );
    const d0 = computeD(amp, oldBalances);

    const d1 = computeD(amp, newBalances);
    if (d1.lt(d0)) {
        throw new Error("New D cannot be less than previous D");
    }

    const adjustedBalances = newBalances.map((newBalance, i) => {
        const oldBalance = oldBalances[i];
        const idealBalance = new Fraction(d1, d0).multiply(oldBalance);
        const difference = idealBalance.subtract(newBalance);
        const diffAbs = difference.greaterThan(0)
            ? difference
            : difference.multiply(-1);
        const fee = normalizedTradeFee(
            swapFee,
            N_COINS,
            new BigNumber(diffAbs.toFixed(0))
        );
        return newBalance.minus(new BigNumber(fee.toFixed(0)));
    });
    const d2 = computeD(amp, adjustedBalances);

    const lpSupply = lpTotalSupply;
    const mintAmountRaw = lpSupply.raw.multipliedBy(d2.minus(d0)).idiv(d0);

    const mintAmount = new TokenAmount(lpTotalSupply.token, mintAmountRaw);

    const mintAmountRawBeforeFees = lpSupply.raw
        .multipliedBy(d1.minus(d0))
        .idiv(d0);

    const fees = new TokenAmount(
        lpTotalSupply.token,
        mintAmountRawBeforeFees.minus(mintAmountRaw)
    );
    const mintAmountBeforeFees = new TokenAmount(
        lpTotalSupply.token,
        mintAmountRawBeforeFees
    );

    return {
        mintAmount,
        mintAmountBeforeFees,
        fees,
    };
};
