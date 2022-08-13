import BigNumber from "bignumber.js";
import { Fraction } from "helper/fraction/fraction";
import { IESDTInfo } from "./token";

/**
 * Represents a quantity of tokens.
 */
export class TokenAmount extends Fraction {
    /**
     * amount _must_ be raw, i.e. in the native representation (wei)
     */
    constructor(readonly token: IESDTInfo, amount: BigNumber.Value) {
        super(new BigNumber(amount), new BigNumber(10).exponentiatedBy(token.decimals));
        this.token = token;
    }

    withAmount(amount: BigNumber.Value): TokenAmount {
        return new TokenAmount(this.token, amount);
    }

    get raw(): BigNumber {
        return this.numerator;
    }

    get egld(): BigNumber {
        return this.numerator.div(this.denominator);
    }

    override add(other: this): TokenAmount {
        if (this.token.identifier !== other.token.identifier) {
            throw new Error(
                `subtract token mismatch: ${this.token.identifier} !== ${other.token.identifier}`
            );
        }
        return this.withAmount(this.raw.plus(other.raw));
    }

    override subtract(other: this): TokenAmount {
        if (this.token.identifier !== other.token.identifier) {
            throw new Error(
                `subtract token mismatch: ${this.token.identifier} !== ${other.token.identifier}`
            );
        }
        return this.withAmount(this.raw.minus(other.raw));
    }

    /**
     * Returns true if the other object is a {@link TokenAmount}.
     *
     * @param other
     * @returns
     */
    static isTokenAmount<A extends TokenAmount>(other: unknown): other is A {
        return (
            Fraction.isFraction(other) &&
            !!(other as unknown as Record<string, unknown>)?.token
        );
    }
}
