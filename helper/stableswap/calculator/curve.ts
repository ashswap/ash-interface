import assert from "assert";
import BigNumber from "bignumber.js";
import { TokenAmount } from "helper/token/tokenAmount";

// maximum iterations of newton's method approximation
const MAX_ITERS = 20;

/**
 * Compute the StableSwap invariant
 * @param ampFactor Amplification coefficient (A)
 * @param amountA Swap balance of token A
 * @param amountB Swap balance of token B
 * Reference: https://github.com/curvefi/curve-contract/blob/7116b4a261580813ef057887c5009e22473ddb7d/tests/simulation.py#L31
 */
export const computeD = (
    ampFactor: BigNumber,
    amounts: BigNumber[]
): BigNumber => {
    const nCoins = new BigNumber(amounts.length);
    const Ann = ampFactor.multipliedBy(nCoins); // A*n^n
    const S = amounts.reduce((total, a) => total.plus(a), new BigNumber(0)); // sum(x_i), a.k.a S
    if (S.eq(0)) {
        return new BigNumber(0);
    }

    let dPrev = new BigNumber(0);
    let d = S;

    for (let i = 0; d.minus(dPrev).abs().gt(1) && i < MAX_ITERS; i++) {
        dPrev = d;
        let dP = d;
        amounts.map((a) => {
            dP = dP.multipliedBy(d).idiv(a.multipliedBy(nCoins));
        });
        const dNumerator = d.multipliedBy(
            Ann.multipliedBy(S).plus(dP.multipliedBy(nCoins))
        );
        const dDenominator = d
            .multipliedBy(Ann.minus(1))
            .plus(dP.multipliedBy(nCoins.plus(1)));
        d = dNumerator.idiv(dDenominator);
    }

    return d;
};

/**
 * Compute Y amount in respect to X on the StableSwap curve
 * @param ampFactor Amplification coefficient (A)
 * @param x The quantity of underlying asset
 * @param d StableSwap invariant
 * Reference: https://github.com/curvefi/curve-contract/blob/7116b4a261580813ef057887c5009e22473ddb7d/tests/simulation.py#L55
 */
export const computeY = (
    ampFactor: BigNumber,
    x: BigNumber,
    d: BigNumber,
    nCoins: BigNumber = new BigNumber(2)
): BigNumber => {
    const Ann = ampFactor.multipliedBy(nCoins); // A*n^n
    // sum' = prod' = x
    const b = x.plus(d.idiv(Ann)).minus(d); // b = sum' - (A*n**n - 1) * D / (A * n**n)
    const c = d.pow(3).idiv(nCoins.pow(2).multipliedBy(x).multipliedBy(Ann)); // c =  D ** (n + 1) / (n ** (2 * n) * prod' * A)

    let yPrev = new BigNumber(0);
    let y = d;
    for (let i = 0; i < MAX_ITERS && y.minus(yPrev).abs().gt(1); i++) {
        yPrev = y;
        y = y.pow(2).plus(c).idiv(nCoins.multipliedBy(y).plus(b));
    }

    return y;
};

export const computeY2 = (
    ampFactor: BigNumber,
    reserves: TokenAmount[],
    fromAmount: TokenAmount,
    tokenOut: string
) => {
    const nCoins = new BigNumber(reserves.length);

    const d = computeD(
        ampFactor,
        reserves.map((r) => r.raw)
    );
    const Ann = ampFactor.multipliedBy(nCoins); // A*n^n

    let c = d;
    let s = new BigNumber(0);

    for (const r of reserves) {
        let amt = r;
        if (r.token.identifier === fromAmount.token.identifier) {
            amt = r.add(fromAmount);
        } else if (r.token.identifier === tokenOut) {
            continue;
        }
        s = s.plus(amt.raw);
        c = c.multipliedBy(d).idiv(amt.raw.multipliedBy(nCoins));
    }

    c = c.multipliedBy(d).idiv(Ann.multipliedBy(nCoins));

    const b = s.plus(d.idiv(Ann)).minus(d);
    let yPrev = new BigNumber(0);
    let y = d;
    for (let i = 0; i < MAX_ITERS && y.minus(yPrev).abs().gt(1); i++) {
        yPrev = y;
        y = y.pow(2).plus(c).idiv(y.plus(y).plus(b));
    }

    return y;
};

export const computeYD = (
    ampFactor: BigNumber,
    index: number,
    reserves: TokenAmount[],
    D: BigNumber
) => {
    const nCoins = reserves.length;
    assert(index >= 0, "index must be greater than 0");
    assert(index < nCoins, "index must be smaller than nCoins");

    const Ann = ampFactor.multipliedBy(nCoins);
    let s = new BigNumber(0);
    let _x = new BigNumber(0);
    let c = D;

    for (let i = 0; i < nCoins; i++) {
        if (i !== index) {
            _x = reserves[i].raw;
        } else {
            continue;
        }
        s = s.plus(_x);
        c = c.multipliedBy(D).idiv(_x.multipliedBy(nCoins));
    }

    c = c.multipliedBy(D).idiv(Ann.multipliedBy(nCoins));
    const b = s.plus(D.idiv(Ann)).minus(D);
    let yPrev = new BigNumber(0);
    let y = D;

    for (let i = 0; i < MAX_ITERS && y.minus(yPrev).abs().gt(1); i++) {
        yPrev = y;
        y = y.pow(2).plus(c).idiv(y.plus(y).plus(b));
    }
    return y;
};
