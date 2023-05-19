import BigNumber from "bignumber.js";
import { Fraction } from "helper/fraction/fraction";
import { IESDTInfo } from "helper/token/token";
import { TokenAmount } from "helper/token/tokenAmount";
import { computeD, computeY2, computeYD } from "./curve";

const PRECISION = new BigNumber(1e18);
const DOUBLE_PRECISION = PRECISION.multipliedBy(PRECISION);
export const getTokenRate = (token: IESDTInfo) => {
    return new BigNumber(10).pow(18 * 2 - token.decimals);
};
export const getRateMultiplier = (decimals: number) => {
    return new BigNumber(10).pow(18 - decimals);
};
export const computeDNormalizeDecimal = (
    ampFactor: BigNumber,
    amounts: TokenAmount[],
    underlyingPrices: BigNumber[],
    precision: BigNumber = new BigNumber(1e18)
) => {
    const doublePrecision = precision.multipliedBy(precision);
    return computeD(
        ampFactor,
        amounts.map((amt, i) =>
            amt.raw
                .multipliedBy(getTokenRate(amt.token))
                .multipliedBy(underlyingPrices[i])
                .idiv(doublePrecision)
        )
    );
};
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
 * @deprecated this function only support stable pool which attempts there are no underlying tokens
 * @param amp
 * @param reserves
 * @param fromAmount
 * @param toToken
 * @param fees
 * @returns
 */
export const calculateEstimatedSwapOutputAmount2 = (
    amp: BigNumber,
    reserves: TokenAmount[],
    fromAmount: TokenAmount,
    toToken: IESDTInfo,
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
    const fromReserve = reserves.find(
        (r) => r.token.identifier === fromAmount.token.identifier
    );
    const toReserve = reserves.find(
        (r) => r.token.identifier === toToken.identifier
    );
    const fromRate = getTokenRate(fromAmount.token);
    const toRate = getTokenRate(toToken);

    if (fromAmount.equalTo(0) || !fromReserve || !toReserve) {
        const zero = new TokenAmount(toToken, 0);
        return {
            outputAmountBeforeFees: zero,
            outputAmount: zero,
            fee: zero,
            lpFee: zero,
            adminFee: zero,
        };
    }

    const oldReserves = reserves.map(
        (r) =>
            new TokenAmount(
                r.token,
                r.raw.multipliedBy(getTokenRate(r.token)).idiv(PRECISION)
            )
    );
    const fromAmountNormalized = new TokenAmount(
        fromAmount.token,
        fromAmount.raw.multipliedBy(fromRate).idiv(PRECISION)
    );
    const toReserveNormalized = new TokenAmount(
        toReserve.token,
        toReserve.raw.multipliedBy(toRate).idiv(PRECISION)
    );

    const toNormalized = computeY2(
        amp,
        oldReserves,
        fromAmountNormalized,
        toToken.identifier
    );
    const dy = toReserveNormalized.raw.minus(toNormalized);

    const amountBeforeFees = dy.multipliedBy(PRECISION).idiv(toRate);

    const outputAmountBeforeFees = new TokenAmount(
        toReserve.token,
        amountBeforeFees
    );

    const fee = new TokenAmount(
        toReserve.token,
        fees.swap.multiply(dy).multiply(PRECISION).toBigNumber().idiv(toRate)
    );

    const adminFee = new TokenAmount(
        toReserve.token,
        fees.admin.multiply(fee.raw).toFixed(0)
    );
    const lpFee = fee.subtract(adminFee);

    const outputAmount = new TokenAmount(
        toReserve.token,
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
export const calculateEstimatedSwapOutputAmount = (
    amp: BigNumber,
    reserves: TokenAmount[],
    fromAmount: TokenAmount,
    toToken: IESDTInfo,
    fees: {
        swap: Fraction;
        admin: Fraction;
    },
    underlyingPrices: BigNumber[]
): {
    [K in
        | "outputAmountBeforeFees"
        | "outputAmount"
        | "fee"
        | "lpFee"
        | "adminFee"]: TokenAmount;
} => {
    const fromIndex = reserves.findIndex(
        (r) => r.token.identifier === fromAmount.token.identifier
    );
    const toIndex = reserves.findIndex(
        (r) => r.token.identifier === toToken.identifier
    );
    const fromReserve = reserves[fromIndex];
    const toReserve = reserves[toIndex];
    const fromPrice = underlyingPrices[fromIndex];
    const toPrice = underlyingPrices[toIndex];
    const fromRate = getTokenRate(fromAmount.token);
    const toRate = getTokenRate(toToken);

    if (fromAmount.equalTo(0) || !fromReserve || !toReserve) {
        const zero = new TokenAmount(toToken, 0);
        return {
            outputAmountBeforeFees: zero,
            outputAmount: zero,
            fee: zero,
            lpFee: zero,
            adminFee: zero,
        };
    }

    const oldReserves = reserves.map(
        (r, i) =>
            new TokenAmount(
                r.token,
                r.raw
                    .multipliedBy(getTokenRate(r.token))
                    .multipliedBy(underlyingPrices[i])
                    .idiv(DOUBLE_PRECISION)
            )
    );
    const fromAmountNormalized = new TokenAmount(
        fromAmount.token,
        fromAmount.raw
            .multipliedBy(fromRate)
            .multipliedBy(fromPrice)
            .idiv(DOUBLE_PRECISION)
    );
    const toReserveNormalized = new TokenAmount(
        toReserve.token,
        toReserve.raw
            .multipliedBy(toRate)
            .multipliedBy(toPrice)
            .idiv(DOUBLE_PRECISION)
    );

    const toNormalized = computeY2(
        amp,
        oldReserves,
        fromAmountNormalized,
        toToken.identifier
    );
    const dy = toReserveNormalized.raw.minus(toNormalized);

    const amountBeforeFees = dy
        .multipliedBy(DOUBLE_PRECISION)
        .idiv(toRate.multipliedBy(toPrice));

    const outputAmountBeforeFees = new TokenAmount(
        toReserve.token,
        amountBeforeFees
    );

    const dyFeeNormalized = fees.swap.multiply(dy).quotient;

    const fee = new TokenAmount(
        toReserve.token,
        dyFeeNormalized
            .multipliedBy(DOUBLE_PRECISION)
            .idiv(toRate.multipliedBy(toPrice))
    );

    const adminFee = new TokenAmount(
        toReserve.token,
        fees.admin
            .multiply(dyFeeNormalized)
            .quotient.multipliedBy(DOUBLE_PRECISION)
            .idiv(toRate.multipliedBy(toPrice))
    );

    const lpFee = fee.subtract(adminFee);

    const outputAmount = new TokenAmount(
        toReserve.token,
        dy
            .minus(dyFeeNormalized)
            .multipliedBy(DOUBLE_PRECISION)
            .idiv(toRate.multipliedBy(toPrice))
    );

    return {
        outputAmountBeforeFees,
        outputAmount,
        fee: fee,
        lpFee,
        adminFee,
    };
};

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
    // const adjustedTradeFee = new Fraction(
    //     n_coins,
    //     n_coins.minus(1).multipliedBy(4)
    // );
    // return new Fraction(amount, 1).multiply(swapFee).multiply(adjustedTradeFee);
    const feePercent = swapFee.numerator
        .multipliedBy(n_coins)
        .idiv(n_coins.minus(1).multipliedBy(4));
    return new Fraction(
        feePercent.multipliedBy(amount).idiv(swapFee.denominator),
        1
    );
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
    depositAmounts: BigNumber[],
    underlyingPrices: BigNumber[]
): {
    mintAmountBeforeFees: TokenAmount;
    mintAmount: TokenAmount;
    fees: TokenAmount;
} => {
    if (depositAmounts.every((amt) => amt.eq(0)) || lpTotalSupply.equalTo(0)) {
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
    const d0 = computeDNormalizeDecimal(
        amp,
        oldBalances.map((bal, i) => new TokenAmount(reserves[i].token, bal)),
        underlyingPrices
    );

    const d1 = computeDNormalizeDecimal(
        amp,
        newBalances.map((bal, i) => new TokenAmount(reserves[i].token, bal)),
        underlyingPrices
    );
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
            new BigNumber(reserves.length),
            new BigNumber(diffAbs.toFixed(0))
        );
        return newBalance.minus(new BigNumber(fee.toFixed(0)));
    });
    const d2 = computeDNormalizeDecimal(
        amp,
        adjustedBalances.map(
            (bal, i) => new TokenAmount(reserves[i].token, bal)
        ),
        underlyingPrices
    );

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

export const calculateEstimatedWithdrawOneCoin = (
    indexTokenOut: number,
    amp: BigNumber,
    totalSupply: TokenAmount,
    lpAmount: TokenAmount,
    reserves: TokenAmount[],
    withdrawFee = new Fraction(0),
    underlyingPrices?: BigNumber[],
) => {
    // if underlying is not provided - plain Pool otherwise the pool is lending or meta pool.
    const _underlyingPrices = !underlyingPrices?.length ? reserves.map(r => new BigNumber(PRECISION)) : underlyingPrices;

    const nCoins = reserves.length;
    const baseFee = withdrawFee.numerator
        .multipliedBy(nCoins)
        .idiv(4 * (nCoins - 1));
    const rates = reserves.map((r) => getTokenRate(r.token));
    const xp = reserves.map((r, i) =>
        r.raw.multipliedBy(rates[i]).multipliedBy(_underlyingPrices[i]).idiv(DOUBLE_PRECISION)
    );

    const D0 = computeD(amp, xp);
    const D1 = D0.minus(lpAmount.raw.multipliedBy(D0).idiv(totalSupply.raw));
    const new_y = computeYD(amp, indexTokenOut, xp.map((xpi, i) => new TokenAmount(reserves[i].token, xpi)), D1);

    const xp_reduced: BigNumber[] = [];
    for (let i = 0; i < nCoins; i++) {
        let dx_expected = new BigNumber(0);
        const xp_i = xp[i];
        if (i === indexTokenOut) {
            dx_expected = xp_i.multipliedBy(D1).idiv(D0).minus(new_y);
        } else {
            dx_expected = xp_i.minus(xp_i.multipliedBy(D1).idiv(D0));
        }
        xp_reduced[i] = xp_i.minus(
            baseFee.multipliedBy(dx_expected).idiv(withdrawFee.denominator)
        );
    }

    let dy = xp_reduced[indexTokenOut].minus(
        computeYD(
            amp,
            indexTokenOut,
            reserves.map((r, i) => new TokenAmount(r.token, xp_reduced[i])),
            D1
        )
    );
    const dy_0 = xp[indexTokenOut]
        .minus(new_y)
        .multipliedBy(DOUBLE_PRECISION)
        .idiv(rates[indexTokenOut].multipliedBy(_underlyingPrices[indexTokenOut])); // without fee
    dy = dy.multipliedBy(DOUBLE_PRECISION).idiv(rates[indexTokenOut].multipliedBy(_underlyingPrices[indexTokenOut]));

    return {
        withdrawAmountBeforeFee: new TokenAmount(
            reserves[indexTokenOut].token,
            dy_0
        ),
        withdrawAmount: new TokenAmount(reserves[indexTokenOut].token, dy),
        fee: new TokenAmount(reserves[indexTokenOut].token, dy_0.minus(dy)),
    };
};
