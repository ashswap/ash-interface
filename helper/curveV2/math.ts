import assert from "assert";
import BigNumber from "bignumber.js";
import { TokenAmount } from "helper/token/tokenAmount";
import { getCurveV2Config } from "./config";
export class CurveV2Math {
    static sort = (A0: BigNumber[]) => {
        const A = [...A0];
        const nCoins = A0.length;
        for (let i = 1; i<nCoins; i++) {
            const x = A[i];
            let cur = i;
            for (let j = 0; j<nCoins; j++){
                const y = A[cur -1];
                if(y.gt(x)){
                    break;
                }
                A[cur] = y;
                cur -= 1;
                if(cur === 0){
                    break;
                }
    
            }
            A[cur] = x;
        }
        return A;
    }

    static geometric_mean = (unsorted_x: BigNumber[], useSort = true) => {
        const nCoins = unsorted_x.length;
        let x = [...unsorted_x];
        if(useSort){
            x = CurveV2Math.sort(unsorted_x);
        }
        let D = x[0];
        let diff = new BigNumber(0);
        for(let i = 0; i<255; i++){
            let D_prev = D;
            const temp = x.reduce((s, _x) => s.multipliedBy(_x), new BigNumber(1)).idiv(D.pow(nCoins - 1));
            D = D.multipliedBy(nCoins - 1).plus(temp).idiv(nCoins);
            // D = D.plus(x[0].multipliedBy(x[1]).idiv(D)).idiv(nCoins); // n = 2
            diff = D.minus(D_prev).abs();
            if(diff.lte(1) || diff.multipliedBy(10**18).lt(D)){
                return D;
            }
        }
        throw new Error("Did not converge");
    }

    static newton_d(ANN: BigNumber, gamma: BigNumber, x_unsorted: BigNumber[], reserves: TokenAmount[]) {
        const {N_COINS, A_MULTIPLIER, MIN_A, MAX_A, MIN_GAMMA, MAX_GAMMA, PRECISION} = getCurveV2Config(reserves);
        assert(ANN.gt(MIN_A.minus(1)) && ANN.lt(MAX_A.plus(1)), "invalid ann");
        assert(gamma.gt(MIN_GAMMA.minus(1)) && gamma.lt(MAX_GAMMA.plus(1)), "invalid gamma");

        const x = CurveV2Math.sort(x_unsorted);

        assert(x[0].gt(1e9 - 1) && x[0].lt(new BigNumber(1e15).multipliedBy(1e18).plus(1)), "invalid x0");
        assert(x[1].multipliedBy(1e18).idiv(x[0]).gt(1e14 - 1), "invalid x1");

        let D = CurveV2Math.geometric_mean(x, false).multipliedBy(N_COINS);
        const S = x.reduce((s, xi) => s.plus(xi), new BigNumber(0));
    
        for (let i = 0; i<255; i++){
            let D_prev = D;
            let K0 = x[0].multipliedBy(PRECISION).multipliedBy(new BigNumber(N_COINS).pow(N_COINS)).idiv(D).multipliedBy(x[1]).idiv(D);
    
            let _g1k0 = gamma.plus(PRECISION);
            _g1k0 = K0.minus(_g1k0).abs().plus(1);
    
            // D / (A * N**N) * _g1k0**2 / gamma**2
            let mul1 = D.multipliedBy(PRECISION).idiv(gamma).multipliedBy(_g1k0).idiv(gamma).multipliedBy(_g1k0).multipliedBy(A_MULTIPLIER).idiv(ANN);
            // 2*N*K0 / _g1k0
            let mul2 = PRECISION.multipliedBy(2).multipliedBy(N_COINS).multipliedBy(K0).idiv(_g1k0);
    
            let neg_fprime = S.plus(S.multipliedBy(mul2).idiv(PRECISION)).plus(mul1.multipliedBy(N_COINS).idiv(K0)).minus(mul2.multipliedBy(D).idiv(PRECISION));
    
            let D_plus = D.multipliedBy(neg_fprime.plus(S)).idiv(neg_fprime);
            let D_minus = D.multipliedBy(D).idiv(neg_fprime);
    
            if(PRECISION.gt(K0)){
                D_minus = D_minus.plus(D.multipliedBy(mul1.idiv(neg_fprime)).idiv(PRECISION).multipliedBy(PRECISION.minus(K0)).idiv(K0));
            }else{
                D_minus = D_minus.minus(D.multipliedBy(mul1.idiv(neg_fprime)).idiv(PRECISION).multipliedBy(K0.minus(PRECISION)).idiv(K0));
            }
    
            if(D_plus.gt(D_minus)){
                D = D_plus.minus(D_minus);
            } else{
                D = D_minus.minus(D_plus).idiv(2);
            }
    
            let diff = D.minus(D_prev).abs();

            let max_d = BigNumber.max(D, 1e16);
    
            if(diff.multipliedBy(10**14).lt(max_d)){
                for (let _x of x){
                    let frac = _x.multipliedBy(PRECISION).idiv(D);
                    assert(frac.gt(1e16 - 1) && frac.lt(new BigNumber(1e18).multipliedBy(1e2).plus(1)), "unsafe value")
                }
                return D;
            }
        }
        throw new Error("Did not converge");
    }

    static newton_y(ANN: BigNumber, gamma: BigNumber, x: BigNumber[], D: BigNumber, i: number, reserves: TokenAmount[]) {
        // Calculating x[i] given other balances x[0..N_COINS-1] and invariant D
        // ANN = A * N**N
        const {N_COINS, MIN_A, MAX_A, MIN_GAMMA, MAX_GAMMA, A_MULTIPLIER, PRECISION} = getCurveV2Config(reserves);
        assert(ANN.gt(MIN_A.minus(1)) && ANN.lt(MAX_A.plus(1)), "Unsafe value A");
        assert(gamma.gt(MIN_GAMMA.minus(1)) && gamma.lt(MAX_GAMMA.plus(1)), "Unsafe value gamma");
        assert(D.gt(10**17 - 1) && D.lt(new BigNumber(1e15).multipliedBy(1e18).plus(1)), "invalid d");
    
        for (let k = 0; k < N_COINS; k++){
            if(k !== i){
                let frac = x[k].multipliedBy(10**18).idiv(D);
                assert(frac.gt(10**16 -1) && frac.lt(new BigNumber(10**20).minus(1)))
            }
        }

        const x_j = x[1-i];
        let y = D.multipliedBy(D).idiv(x_j.multipliedBy(N_COINS).multipliedBy(N_COINS));
        let K0_i = x_j.multipliedBy(PRECISION).multipliedBy(N_COINS).idiv(D);
        assert(K0_i.gt(new BigNumber(N_COINS).multipliedBy(1e16).minus(1)) && K0_i.lt(new BigNumber(N_COINS).multipliedBy(1e16).multipliedBy(1e4).plus(1)), "unsafe value");
        let S_i = new BigNumber(0);
    
        const convergence_limit = BigNumber.max(BigNumber.max(x_j.idiv(1e14), D.idiv(1e14)), 100);
    
        for(let j = 0; j<255; j++){
            let y_prev = y;
            let K0 = K0_i.multipliedBy(y).multipliedBy(N_COINS).idiv(D);
            let S = x_j.plus(y);
    
            let _g1k0 = gamma.plus(1e18);
            _g1k0 = K0.minus(_g1k0).abs().plus(1);
    
            let mul1 = D.multipliedBy(PRECISION).idiv(gamma).multipliedBy(_g1k0).idiv(gamma).multipliedBy(_g1k0).multipliedBy(A_MULTIPLIER).idiv(ANN);
    
            let mul2 = K0.multipliedBy(2).multipliedBy(PRECISION).idiv(_g1k0).plus(PRECISION);
    
            let yfprime = y.multipliedBy(PRECISION).plus(S.multipliedBy(mul2)).plus(mul1);
            let _dyfprime = D.multipliedBy(mul2);
    
            if(yfprime.lt(_dyfprime)){
                y = y_prev.idiv(2);
                continue;
            }else{
                yfprime = yfprime.minus(_dyfprime);
            }
            let fprime = yfprime.idiv(y);
    
            let y_minus = mul1.idiv(fprime);
            let y_plus = D.multipliedBy(PRECISION).plus(yfprime).idiv(fprime).plus(y_minus.multipliedBy(PRECISION).idiv(K0));
            y_minus = y_minus.plus(S.multipliedBy(PRECISION).idiv(fprime));
    
            if(y_plus.lt(y_minus)){
                y = y_prev.idiv(2);
            } else{
                y = y_plus.minus(y_minus);
            }
    
            let diff = y.minus(y_prev).abs();
    
            if(diff.lt(BigNumber.max(convergence_limit, y.idiv(1e14)))){
                const frac = y.multipliedBy(PRECISION).idiv(D);
                assert(frac.gt(1e16 - 1) && frac.lt(new BigNumber(1e18).multipliedBy(1e2).plus(1)), "Unsafe value for y");
                return y;
            }
        }
        throw new Error("Did not converge");
    } 
}