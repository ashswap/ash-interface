import BigNumber from "bignumber.js";

/**
 * Attempts to parse a {@link Fraction}.
 * @param fractionish Fraction or BigintIsh.
 * @returns
 */
const tryParseFraction = (
    fractionish: BigNumber.Value | Fraction
): Fraction => {
    if (Fraction.isFraction(fractionish)) {
        return fractionish;
    }

    try {
        return new Fraction(fractionish);
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(`Could not parse fraction: ${e.message}`);
        }
        throw new Error(`Could not parse fraction`);
    }
};

/**
 * Interface representing a Fraction.
 */
export interface FractionObject {
    /**
     * This boolean checks to see if this is actually a {@link Fraction}.
     */
    readonly isFraction: true;

    /**
     * Fraction numerator.
     */
    readonly numeratorStr: string;

    /**
     * Fraction denominator.
     */
    readonly denominatorStr: string;
}

/**
 * Creates a {@link Fraction} from a {@link FractionObject}.
 * @param param0
 * @returns
 */
export const fractionFromObject = ({
    numeratorStr,
    denominatorStr,
}: FractionObject): Fraction => {
    return new Fraction(numeratorStr, denominatorStr);
};

/**
 * Number with an integer numerator and denominator.
 */
export class Fraction implements FractionObject {
    readonly isFraction: true = true;
    get numeratorStr(): string {
        return this.numerator.toString();
    }
    get denominatorStr(): string {
        return this.numerator.toString();
    }

    readonly numerator: BigNumber;
    readonly denominator: BigNumber;

    static readonly ZERO: Fraction = new Fraction(0);
    static readonly ONE: Fraction = new Fraction(1);

    constructor(numerator: BigNumber.Value, denominator: BigNumber.Value = 1) {
        this.numerator = new BigNumber(numerator);
        this.denominator = new BigNumber(denominator);
    }

    /**
     * Ensures the other object is of this {@link Fraction} type.
     * @param other
     * @returns
     */
    static fromObject(other: FractionObject): Fraction {
        if (other instanceof Fraction) {
            return other;
        }
        return fractionFromObject(other);
    }

    /**
     * create Fraction from BigNumber value
     * @param number Bignumber value
     * @returns 
     */
    static fromBigNumber(number: BigNumber.Value) {
        const big = new BigNumber(number);
        const [numerator, denominator] = big.eq(0) ? [0, 1] : big.toFraction();
        return new Fraction(numerator, denominator);
    }

    /**
     * JSON representation of the {@link Fraction}.
     */
    toJSON(): FractionObject {
        return {
            isFraction: true,
            numeratorStr: this.numerator.toString(),
            denominatorStr: this.denominator.toString(),
        };
    }

    /**
     * Returns true if the other object is a {@link Fraction}.
     *
     * @param other
     * @returns
     */
    static isFraction(other: unknown): other is Fraction {
        return (
            typeof other === "object" &&
            other !== null &&
            "numerator" in other &&
            "denominator" in other
        );
    }

    /**
     * Compares this {@link Fraction} to the other {@link Fraction}.
     */
    compareTo(other: Fraction): -1 | 0 | 1 {
        if (this.equalTo(other)) {
            return 0;
        }
        return this.greaterThan(other) ? 1 : -1;
    }

    /**
     * Parses a {@link Fraction} from a float.
     * @param number Number to parse.
     * @param decimals Number of decimals of precision. (default 10)
     * @returns Fraction
     */
    static fromNumber(number: number, decimals = 10): Fraction {
        const multiplier = Math.pow(10, decimals);
        return new Fraction(Math.floor(number * multiplier), multiplier);
    }

    /**
     * Performs floor division.
     */
    get quotient(): BigNumber {
        return this.numerator.idiv(this.denominator);
    }

    /**
     * Remainder after floor division.
     */
    get remainder(): Fraction {
        return new Fraction(
            this.numerator.mod(this.denominator),
            this.denominator
        );
    }

    /**
     * Perform division and return as BigNumber
     * @returns BigNumber
     */
    toBigNumber(): BigNumber {
        return this.numerator.div(this.denominator);
    }

    /**
     * Swaps the numerator and denominator of the {@link Fraction}.
     * @returns
     */
    invert(): Fraction {
        return new Fraction(this.denominator, this.numerator);
    }

    add(other: Fraction | BigNumber.Value): Fraction {
        const otherParsed = tryParseFraction(other);
        if (this.denominator.eq(otherParsed.denominator)) {
            return new Fraction(
                this.numerator.plus(otherParsed.numerator),
                this.denominator
            );
        }
        return new Fraction(
            this.numerator
                .multipliedBy(otherParsed.denominator)
                .plus(otherParsed.numerator.multipliedBy(this.denominator)),
            this.denominator.multipliedBy(otherParsed.denominator)
        );
    }

    subtract(other: Fraction | BigNumber.Value): Fraction {
        const otherParsed = tryParseFraction(other);
        if (this.denominator.eq(otherParsed.denominator)) {
            return new Fraction(
                this.numerator.minus(otherParsed.numerator),
                this.denominator
            );
        }
        return new Fraction(
            this.numerator
                .multipliedBy(otherParsed.denominator)
                .minus(otherParsed.numerator.multipliedBy(this.denominator)),
            this.denominator.multipliedBy(otherParsed.denominator)
        );
    }

    lessThan(other: Fraction | BigNumber.Value): boolean {
        const otherParsed = tryParseFraction(other);
        return this.numerator
            .multipliedBy(otherParsed.denominator)
            .lt(otherParsed.numerator.multipliedBy(this.denominator));
    }

    equalTo(other: Fraction | BigNumber.Value): boolean {
        const otherParsed = tryParseFraction(other);
        return this.numerator
            .multipliedBy(otherParsed.denominator)
            .eq(otherParsed.numerator.multipliedBy(this.denominator));
    }

    greaterThan(other: Fraction | BigNumber.Value): boolean {
        const otherParsed = tryParseFraction(other);
        return this.numerator
            .multipliedBy(otherParsed.denominator)
            .gt(otherParsed.numerator.multipliedBy(this.denominator));
    }

    multiply(other: Fraction | BigNumber.Value): Fraction {
        const otherParsed = tryParseFraction(other);
        return new Fraction(
            this.numerator.multipliedBy(otherParsed.numerator),
            this.denominator.multipliedBy(otherParsed.denominator)
        );
    }

    /**
     * Divides this {@link Fraction} by another {@link Fraction}.
     */
    divide(other: Fraction | BigNumber.Value): Fraction {
        const otherParsed = tryParseFraction(other);
        return new Fraction(
            this.numerator.multipliedBy(otherParsed.denominator),
            this.denominator.multipliedBy(otherParsed.numerator)
        );
    }

    /**
     * Helper method for converting any super class back to a fraction
     */
    get asFraction(): Fraction {
        return new Fraction(this.numerator, this.denominator);
    }

    /**
     * Returns true if this number (the numerator) is equal to zero and the denominator is non-zero.
     * @returns
     */
    isZero(): boolean {
        return this.numerator.eq(0) && !this.denominator.eq(0);
    }

    /**
     * Returns true if this number (the numerator) is not equal to zero.
     * @returns
     */
    isNonZero(): boolean {
        return !this.isZero();
    }

    toFixed(decimalPlaces: number){
        return this.numerator.div(this.denominator).toFixed(decimalPlaces);
    }

    toSignificant(significantDigits: number = 6): string{
        if(this.quotient.toString(10).length >= significantDigits){
            return this.quotient.toString(10);
        }
        return this.toBigNumber().toPrecision(significantDigits).replace(/0+$/, "");
    }
}