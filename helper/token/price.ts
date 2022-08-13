import { Fraction } from "helper/fraction/fraction";
import { IESDTInfo } from "./token";
import { TokenAmount } from "./tokenAmount";

export class Price extends Fraction {
    readonly baseToken: IESDTInfo;
    readonly token: IESDTInfo;
    readonly numeratorTokenAmount: TokenAmount;
    readonly denominatorTokenAmount: TokenAmount;
    constructor(numeratorTokenAmount: TokenAmount, denominatorTokenAmount: TokenAmount){
        const fraction = numeratorTokenAmount.asFraction.divide(denominatorTokenAmount.asFraction);
        super(fraction.numerator, fraction.denominator);
        this.baseToken = numeratorTokenAmount.token;
        this.token = denominatorTokenAmount.token;
        this.numeratorTokenAmount = numeratorTokenAmount;
        this.denominatorTokenAmount = denominatorTokenAmount;
    }

    get raw(): Fraction {
        return new Fraction(this.numerator, this.denominator);
    }

    override invert(): Price {
        return new Price(this.denominatorTokenAmount, this.numeratorTokenAmount);
    }
}