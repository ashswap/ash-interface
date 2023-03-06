import assert from "assert";
import BigNumber from "bignumber.js";
import { IESDTInfo } from "helper/token/token";
import { TokenAmount } from "helper/token/tokenAmount";
import { getCurveV2Config } from "./config";
import { CurveV2Math } from "./math";

type CurveV2Context = {
    priceScale: BigNumber.Value;
    reserves: BigNumber.Value[];
    ann: BigNumber.Value;
    gamma: BigNumber.Value;
    d: BigNumber.Value;
    futureAGammaTime: number;
    xp: BigNumber.Value[];
    feeGamma: BigNumber.Value;
    midFee: BigNumber.Value;
    outFee: BigNumber.Value;
};
class CurveV2 {
    readonly nCoins: number;
    readonly tokens: IESDTInfo[];
    readonly precisions: BigNumber[];
    readonly PRECISION = new BigNumber(1e18);
    readonly context: CurveV2Context;
    constructor(tokens: IESDTInfo[], context: CurveV2Context) {
        this.nCoins = tokens.length;
        if (this.nCoins !== 2) throw new Error("invalid number of tokens");
        this.tokens = tokens;
        this.context = context;
        this.precisions = tokens.map((t) =>
            new BigNumber(10).pow(18 - t.decimals)
        );
    }

    private _fee(xp: BigNumber[]){
        const fee_gamma = new BigNumber(this.context.feeGamma);
        const mid_fee = new BigNumber(this.context.midFee);
        const out_fee = new BigNumber(this.context.outFee);
        let f = xp[0].plus(xp[1]);
        f = fee_gamma.multipliedBy(this.PRECISION).idiv(
            fee_gamma.plus(this.PRECISION).minus(
                new BigNumber(this.nCoins).pow(this.nCoins).multipliedBy(this.PRECISION).multipliedBy(xp[0]).idiv(f).multipliedBy(xp[1]).idiv(f)
            )
        )
        return mid_fee.multipliedBy(f).plus(out_fee.multipliedBy(this.PRECISION.minus(f))).idiv(this.PRECISION);
    }

    estimateAmountOut(
        i: number,
        j: number,
        dx: BigNumber,
    ) {
        assert(i != j, "same input and output token");
        assert(i < this.nCoins, "coin index out of range");
        assert(j < this.nCoins, "coin index out of range");
        if(dx.eq(0)) return {fee: new BigNumber(0), dy: new BigNumber(0)};

        const [p0, p1] = this.precisions;
        const price_scale = new BigNumber(this.context.priceScale).multipliedBy(p1);
        let xp = this.context.reserves.map((r) => new BigNumber(r));
        const reserves = xp.map((x, _i) => new TokenAmount(this.tokens[_i], x));
        let { ann, gamma, d, futureAGammaTime } = this.context;

        if (futureAGammaTime > 0) {
            d = CurveV2Math.newton_d(
                new BigNumber(ann),
                new BigNumber(gamma),
                this.context.xp.map((x) => new BigNumber(x)),
                reserves
            );
        }

        xp[i] = xp[i].plus(dx);
        xp = [
            xp[0].multipliedBy(p0),
            xp[1].multipliedBy(price_scale).idiv(this.PRECISION),
        ];

        let y = CurveV2Math.newton_y(
            new BigNumber(ann),
            new BigNumber(gamma),
            xp,
            new BigNumber(d),
            j,
            reserves
        );
        let dy = xp[j].minus(y).minus(1);
        xp[j] = y;
        if (j > 0) {
            dy = dy.multipliedBy(this.PRECISION).idiv(price_scale);
        } else {
            dy = dy.idiv(p0);
        }

        const fee = dy.multipliedBy(this._fee(xp)).idiv(1e10);
        dy = dy.minus(fee);
        return {fee, dy};
    }
}

export default CurveV2;
