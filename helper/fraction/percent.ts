import { Fraction } from "./fraction";

export class Percent extends Fraction {
    override toSignificant(significantDigits: number = 5): string {
        return this.multiply(100).toSignificant(significantDigits);
    }
    override toFixed(decimalPlaces: number = 2): string {
        return this.multiply(100).toFixed(decimalPlaces);
    }
}
